// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from 'react'
import CostOnly from './CostOnly'
import { CostAndRates } from './CostAndRates'
import { CostEndpointResponse, DataAvailability } from '../types'

type Props = {
  dataAvailability: DataAvailability
  costData: CostEndpointResponse
}

export function CostPlugin({dataAvailability, costData}: Props) {
  let main

  switch (dataAvailability) {
    case DataAvailability.None:
      main = (
        <h3 style={{color: '#cdcdcd', textAlign: 'center'}}>
          No data yet
        </h3>
      )
      break
    case DataAvailability.Loading:
      main = <h3 style={{color: '#cdcdcd', textAlign: 'center'}}>Loading...</h3>
      break
    case DataAvailability.Error:
      let errMsg: any = 'Error loading cost data'
      if(typeof costData === 'object' && costData && costData.errors) {
        const errs = Array.isArray(costData.errors) ? costData.errors : [costData.errors]
        errMsg = (
            <ul>
              {
                errs.map((e: any) => {
                  return (
                    <li>
                      {e && e.message || ''}
                    </li>
                  )
                })
              }
            </ul>
        )
      }
      main = (
        <h3 style={{color: '#cdcdcd', textAlign: 'center'}}>
          {errMsg}
        </h3>
      )
      break
    case DataAvailability.Available:
      if (
        typeof costData === 'object' &&
        typeof costData.request === 'object' &&
        typeof costData.rateLimits === 'object'
      ) {
        main = <CostAndRates characteristics={costData.request} rateLimits={costData.rateLimits}/>
      } else if (typeof costData.request === 'object') {
        main = <CostOnly characteristics={costData.request} />
      } else {
        main = (
          <h3 style={{color: '#cdcdcd', textAlign: 'center'}}>
            Error rendering cost data
          </h3>
        )
      }
      break
  }

  return <div className="qcs_wrapper">{main}</div>
}
