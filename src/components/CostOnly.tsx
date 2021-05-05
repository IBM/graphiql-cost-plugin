// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from 'react'
import { Characteristics } from '../types'
import { NumberOrInf } from './NumberOrInf'
import DetailsPopover from './DetailsPopover'

type Props = {
  characteristics: Characteristics
}

export default function CostOnly({characteristics}: Props) {
  const typeCountDetails = characteristics.typeCounts && Object.keys(characteristics.typeCounts).map((key) => {
    return <span>{key}: <NumberOrInf num={characteristics.typeCounts[key]}/></span>
  }) || null
  const fieldCountDetails = characteristics.fieldCounts && Object.keys(characteristics.fieldCounts).map((key) => {
    return <span>{key}: <NumberOrInf num={characteristics.fieldCounts[key]}/></span>
  }) || null
  return (
    <div style={{padding: '0.5em 0 0.5em 0.5em'}}>
      <h3
        style={{
          marginBlockStart: '0.2em',
          marginBlockEnd: 0
        }}
      >
        Query cost
      </h3>
      <div style={{paddingLeft: '0.5em'}}>
          Type cost: <NumberOrInf num={characteristics.typeCost}/>
          <DetailsPopover title="Type counts" details={typeCountDetails} />{' '}
      </div>
      <div style={{paddingLeft: '0.5em'}}>
          Field cost: <NumberOrInf num={characteristics.fieldCost}/>
          <DetailsPopover title="Field counts" details={fieldCountDetails} />{' '}
      </div>
    </div>
  )
}
