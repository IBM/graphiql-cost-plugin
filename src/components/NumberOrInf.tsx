// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from 'react'

/**
 * Renders the given number.
 *  - Rounds numbers with decimals to at most 2 decimals
 *  - Returns the infinity sign for numbers >= 2147483647
 */
export function NumberOrInf(props: {num: number}) {
  if (props.num >= 2147483647) {
    return <span>&#8734; </span>
  }
  if (props.num % 1 != 0) {
    return <span>{props.num.toFixed(2)} </span>
  }
  return <span>{props.num.toString()} </span>
}
