// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React, { useState } from 'react'
import { GraphiQL } from 'graphiql'
import { CostPlugin } from 'graphiql-cost-plugin'
import fetch from 'isomorphic-fetch'
import { parse, buildClientSchema, validate } from 'graphql'
import data from './data'

/**
 * Replace with GraphQL backend URL
 */
const BACKEND_URL = 'https://swapi-graphql.netlify.app/.netlify/functions/index'

/**
 * Determines whether to fetch cost data from cost endpoint.
 * If set to true, will attempt to fetch cost from the BACKEND_URL + /cost
 * If set to false, will render mocked data
 */
const USE_COST_ENDPOINT = false

/**
 * Replace with headers to send
 */
const HEADERS = {
  'Content-Type': 'application/json'
  // Add your headers...
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
      const valid = validate(this.state.schema, parse(newQuery)).length === 0
      if (valid) {
        if (USE_COST_ENDPOINT) {
          this.setState({ dataAvailability: 'LOADING' })
          const response = await fetch(BACKEND_URL + '/cost', {
            method: 'post',
            headers: HEADERS,
            body: JSON.stringify({query: newQuery}),
            mode: 'cors'
          })
          if (response.ok) {
            const result = await response.json()
            this.setState({
              dataAvailability: 'AVAILABLE',
              costData: result
            })
          }
        } else {
          this.setState(data)
        }
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
