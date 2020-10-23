// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from 'react'
import { Characteristics, TimeFrame } from '../types'
import { NumberOrInf } from './NumberOrInf'
import DetailsPopover from './DetailsPopover'

type Props = {
  timeFrame: TimeFrame
  limits: {name: string, rate: number}[]
  characteristics: Characteristics
}

function getAllowedTimes(
  rate: number,
  cost: number
) {
  if (rate === 0 || cost === 0) {
    return Number.MAX_SAFE_INTEGER
  }
  return Math.floor(rate / cost)
}

export function TimeFrameDetails({timeFrame, limits, characteristics}: Props) {
  const typeLimit = limits.find(
    (val) => val.name === 'typeCost'
  )
  const fieldLimit = limits.find(
    (val) => val.name === 'fieldCost'
  )

  const typeCountDetails = Object.keys(characteristics.typeCounts).map((key) => {
    return <span>{key}: <NumberOrInf num={characteristics.typeCounts[key]}/></span>
  })
  const fieldCountDetails = Object.keys(characteristics.fieldCounts).map((key) => {
    return <span>{key}: <NumberOrInf num={characteristics.fieldCounts[key]}/></span>
  })
  return (
    <div>
      <h4 style={{marginBlockStart: '0.3em', marginBlockEnd: 0}}>
        Limits for {timeFrame.interval} {timeFrame.unit}
        :
      </h4>
      <div>
        {typeLimit ? (
          <span style={{paddingLeft: '0.5em'}}>
            <NumberOrInf num={getAllowedTimes(typeLimit.rate, characteristics.typeCost)}/>
            times for type cost of <NumberOrInf num={characteristics.typeCost}/>
            <DetailsPopover title="Type counts" details={typeCountDetails} />
          </span>
        ) : (
          <span style={{color: 'gray', paddingLeft: '0.5em'}}>
            No limit defined for type cost
          </span>
        )}
      </div>
      <div>
        {fieldLimit ? (
          <span style={{paddingLeft: '0.5em'}}>
            <NumberOrInf num={getAllowedTimes(fieldLimit.rate, characteristics.fieldCost)}/>
            times for field cost of <NumberOrInf num={characteristics.fieldCost}/>
            <DetailsPopover title="Field counts" details={fieldCountDetails} />
          </span>
        ) : (
          <span style={{color: 'gray', paddingLeft: '0.5em'}}>
            No limit defined for field cost
          </span>
        )}
      </div>
    </div>
  )
}
