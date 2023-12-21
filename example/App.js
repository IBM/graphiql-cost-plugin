// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import 'graphiql/graphiql.min.css';

import React, { useState } from 'react'
import { GraphiQL } from 'graphiql'
import { CostPlugin } from 'graphiql-cost-plugin'
import fetch from 'isomorphic-fetch'
import { parse, buildClientSchema, validate, print } from 'graphql'
import data from './data'

/**
 * Replace with GraphQL backend URL
 */
const BACKEND_URL = 'https://swapi-graphql.netlify.app/.netlify/functions/index'

/**
 * USE_COST_ENDPOINT determines whether to fetch cost and rate limit data.
 * If set to DISABLED, will render mocked data
 * If set to DEPRECATED_COST_PATH, will fetch info from the BACKEND_URL + /cost
 * If set to VIA_INTROSPECTION, will fetch info from the BACKEND_URL using __cost and __rateLimit introspection
 */
const COST_ENDPOINTS = Object.freeze({
	DISABLED: 0,
	DEPRECATED_COST_PATH: 1,
	VIA_INTROSPECTION: 2
})
const USE_COST_ENDPOINT = COST_ENDPOINTS.DISABLED // Change to the type of cost endpoint you would like to use.

/**
 * SKIP_VALIDATION determines if you would like to validate the query against the introspected schema.
 * If set to true, it will skip validation
 * If set to false, it will validate the query against the introspected schema
 */
const SKIP_VALIDATION = true // Change based on if you would like to skip validation or not.

/**
 * Replace with headers to send
 */
const HEADERS = {
  'Content-Type': 'application/json'
  // Add your headers...
}

/**
 * Translate newer "via introspection" counts to deprecated structure style counts
 */
const translateCounts = (requestCosts, request, type) => {
  const counts = requestCosts[type]
  let countsRes = {}
  for(let i = 0; i < counts.length; i++) {
    const count = counts[i]
    const name = count["name"]
    const value = count["value"]
    if (!name.match(/__/))
      countsRes[name] = value
  }
  request[type] = countsRes
}

/**
 * Translate newer "via introspection" rate limits to deprecated structure style rate limits
 */
const translateRateLimits = (rateLimits, rateLimitsRes, type, typeName) => {
  let assemblyLimits = {}

  for(let i = 0; i < rateLimits.length; i++) {
    const rateLimit = rateLimits[i]
    const name = rateLimit["name"]
    const rateLimitValues = rateLimit["rateLimits"]
    const rateLimitValueTypeName = rateLimit["rateLimits"][0]["__typename"]
    if(rateLimitValueTypeName.match(typeName))
      assemblyLimits[name] = rateLimitValues
  }
  rateLimitsRes[type] = assemblyLimits
}

/**
 * Translate newer "via introspection" result to deprecated structure style result
 */
const translateResultToDeprecatedCostStructure = (result) => {
  let res = {}
  let request = {}

  const requestCosts = result.data["__cost"]["requestCosts"]
  request["fieldCost"] = requestCosts["fieldCost"]
  request["typeCost"] = requestCosts["typeCost"]

  translateCounts(requestCosts, request, "typeCounts")
  translateCounts(requestCosts, request, "fieldCounts")

  res["request"] = request

  let rateLimitsRes = {}
  const rateLimits = result.data["__rateLimit"]["rateLimits"]
  translateRateLimits(rateLimits, rateLimitsRes, "assemblyRateLimits", "__RateLimitRateLimitDetails")
  translateRateLimits(rateLimits, rateLimitsRes, "assemblyBurstLimits", "__RateLimitBurstLimitDetails")
  translateRateLimits(rateLimits, rateLimitsRes, "assemblyCountLimits", "__RateLimitCountLimitDetails")

  res["rateLimits"] = rateLimitsRes
  return res;
}

export class App extends React.Component {
  constructor () {
    super()

    this.graphQLFetcher = this.graphQLFetcher.bind(this)
    this.fetchCostData = this.fetchCostData.bind(this)

    this.state = {
      schema: null,
      costData: null,
      dataAvailability: 'NONE'
    }
  }

  async graphQLFetcher(graphQLParams) {
    const response = await fetch(BACKEND_URL, {
      method: 'post',
      headers: HEADERS,
      body: JSON.stringify(graphQLParams),
      mode: 'cors'
    })
    if (response.ok) {
      const result = await response.json()
      if (!this.state.schema && graphQLParams.operationName === 'IntrospectionQuery') {
        this.setState({schema: buildClientSchema(result.data)})
      }
      return result
    }
  }

  async fetchCostData (newQuery) {
    try {
      const valid = SKIP_VALIDATION || validate(this.state.schema, parse(newQuery), rules).length === 0
      if (!valid)
        return

      switch (USE_COST_ENDPOINT) {

        case COST_ENDPOINTS.DEPRECATED_COST_PATH:
          this.setState({ dataAvailability: 'LOADING' })
          const deprecatedResponse = await fetch(BACKEND_URL + '/cost', {
            method: 'post',
            headers: HEADERS,
            body: JSON.stringify({query: newQuery}),
            mode: 'cors'
          })
          if (deprecatedResponse.ok) {
            const result = await deprecatedResponse.json()
            this.setState({
              dataAvailability: 'AVAILABLE',
              costData: result
            })
          }
          break;
        case COST_ENDPOINTS.VIA_INTROSPECTION:
          // Add __cost and __rateLimit to query
          const parsedViaIntrospectionQuery = parse(`
          {
            __cost {
              requestCosts {
                fieldCost
                typeCost
                fieldCounts {
                  name
                  value
                }
                typeCounts {
                  name
                  value
                }
              }
            }
            __rateLimit {
              planName
              rateLimits {
                name
                rateLimits {
                  __typename
                  ... on __RateLimitRateLimitDetails {
                    isHardLimit
                    rate
                    interval
                    unit
                    remaining
                  }
                  ... on __RateLimitBurstLimitDetails {
                    isHardLimit
                    rate
                    interval
                    unit
                    remaining
                  }
                  ... on __RateLimitCountLimitDetails {
                    isHardLimit
                    count
                    remaining
                  }
                }
              }
            }
          }`)
          const selectionsViaIntrospection = parsedViaIntrospectionQuery.definitions[0].selectionSet.selections

          const parsedQuery = parse(newQuery)
          let selections = parsedQuery.definitions[0].selectionSet.selections

          selections.push(selectionsViaIntrospection[0]) // __cost
          selections.push(selectionsViaIntrospection[1]) // __rateLimit

          this.setState({ dataAvailability: 'LOADING' })
          const viaIntrospectionResponse = await fetch(BACKEND_URL, {
            method: 'post',
            headers: HEADERS,
            body: JSON.stringify({query: print(parsedQuery)}),
            mode: 'cors'
          })
          if (viaIntrospectionResponse.ok) {
            const result = await viaIntrospectionResponse.json()
            const res = translateResultToDeprecatedCostStructure(result);
            this.setState({
              dataAvailability: 'AVAILABLE',
              costData: res
            })
          }
          break;
        default:
          this.setState(data)
          break;
      }
    } catch (error) {
      // ignore parse errors
    }
  }

  render() {
    return (
      <GraphiQL fetcher={this.graphQLFetcher} onEditQuery={this.fetchCostData}>
        <GraphiQL.Footer>
          <CostPlugin
            costData={this.state.costData}
            dataAvailability={this.state.dataAvailability}
          />
        </GraphiQL.Footer>
      </GraphiQL>
    )
  }
}
