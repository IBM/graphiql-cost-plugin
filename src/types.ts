// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export type Unit = 'second' | 'minute' | 'hour' | 'day'

/**
 * A single rate limit, used in "assemblyRateLimits" and "rateLimits".
 */
export type RateLimit = {
  rate: number
  interval: number
  unit: Unit
  hardLimit: boolean
}

/**
 * A single count limit, used in "assemblyCountLimits".
 */
export type CountLimit = {
  count: number
  hardLimit: boolean
}

/**
 * Count and cost characteristics of a query.
 */
export type Characteristics = {
  fieldCost: number
  fieldCounts: {[fieldName: string]: number}
  typeCost: number,
  typeCounts: {[typeName: string]: number}
  inputFieldCost: number
  inputTypeCost: number
  argumentCost: number
}

/**
 * Set of ratelimits defined on a gateway.
 */
export type RateLimits = {
  assemblyRateLimits?: {
    [limitKey: string]: RateLimit[]
  }
  rateLimits?: {
    [limitKey: string]: RateLimit[]
  }
  assemblyCountLimits?: {
    [limitKey: string]: CountLimit[]
  }
}

/**
 * The response data returned by a cost endpoint.
 */
export type CostEndpointResponse = {
  query: {
    query: string
    operationType: 'query' | 'mutation' | 'subscription'
  }
  request: Characteristics
  rateLimits?: RateLimits
  name: string
  errors?: any
}

/**
 * The state that cost data is in.
 */
export const enum DataAvailability {
  None = 'NONE',
  Loading = 'LOADING',
  Error = 'ERROR',
  Available = 'AVAILABLE'
}


export type TimeFrame = {
  interval: number
  unit: Unit
}
