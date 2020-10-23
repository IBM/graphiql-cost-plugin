// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React, { useState } from 'react'
import { Characteristics, RateLimits, TimeFrame, RateLimit } from '../types'
import { NumberOrInf } from './NumberOrInf'
import { TimeFrameDetails } from './TimeFrameDetails'
import { Triangle } from './Triangle'

type Props = {
  rateLimits: RateLimits
  characteristics: Characteristics
}

type TimeFrames = {
  timeFrame: TimeFrame
  limits: {name: string, rate: number}[]
}[]

type InFocus = {
  timeFrame: TimeFrame
  limits: {name: string, rate: number}[]
}

function groupByTimeFrames (
  limits: RateLimit[],
  timeFrames: TimeFrames,
  limitName: string
) : void {
  if (!Array.isArray(limits) || limits.length === 0) return

  limits.forEach(limit => {
    const frame = timeFrames
      .find(e => e.timeFrame.interval === limit.interval && e.timeFrame.unit === limit.unit)
    if (frame) {
      frame.limits.push({name: limitName, rate: limit.rate})
    } else {
      timeFrames.push({
        timeFrame: {interval: limit.interval, unit: limit.unit},
        limits: [{name: limitName, rate: limit.rate}]
      })
    }
  })
}

function getMaxAllowed(
  limits: {name: string, rate: number}[],
  characteristics: Characteristics
) {
  let maxAllowed = Number.MAX_SAFE_INTEGER
  limits.forEach(({name, rate}) => {
    const cost = characteristics[name]
    const allowed = typeof cost === 'number' && cost !== 0 && rate !== 0
      ? Math.floor(rate / cost)
      : Number.MAX_SAFE_INTEGER
    if (allowed < maxAllowed) maxAllowed = allowed
  })
  return maxAllowed
}

export function CostAndRates ({characteristics, rateLimits}: Props) {
  // const [allowed, setAllowed] = React.useState<AllowedEntry>(null)
  const [inFocus, setInFocus] = useState<InFocus>(null)

  const fieldCostLimits = rateLimits.assemblyRateLimits?.['graphql-field-cost']
  const typeCostLimits = rateLimits.assemblyRateLimits?.['graphql-type-cost']
  const inputTypeCostLimits = rateLimits.assemblyRateLimits?.['graphql-type-cost']  

  // Re-group all limits based on unique time frames
  const timeFrames : TimeFrames = []
  groupByTimeFrames(fieldCostLimits, timeFrames, 'fieldCost')
  groupByTimeFrames(typeCostLimits, timeFrames, 'typeCost')
  groupByTimeFrames(inputTypeCostLimits, timeFrames, 'inputTypeCost')

  function handleClick (newInFocus: InFocus) {
    if (
      inFocus &&
      inFocus.timeFrame.interval === newInFocus.timeFrame.interval &&
      inFocus.timeFrame.unit === newInFocus.timeFrame.unit
    ) {
      setInFocus(null)
    } else {
      setInFocus(newInFocus)
    }
  }

  let details = inFocus
    ? <TimeFrameDetails
        timeFrame={inFocus.timeFrame}
        characteristics={characteristics}
        limits={inFocus.limits}
      />
    : null

  const main = <div>
    {/* TODO: add Plan name? */}
    <h3 style={{
      marginBlockStart: '0.2em',
      marginBlockEnd: 0,
    }}>Query limits:</h3>
    {timeFrames.map((entry, key) => {
      const maxAllowed = getMaxAllowed(entry.limits, characteristics)
      const linkActive = inFocus
        ? (
            entry.timeFrame.interval === inFocus.timeFrame.interval &&
            entry.timeFrame.unit === inFocus.timeFrame.unit
          )
        : false
      const link = <span
        onClick={() => handleClick(entry)}
        style={{
          fontStyle: 'italic',
          textDecorationStyle: 'dotted',
          cursor: 'pointer',
          paddingLeft: 10
        }}
        >
          {linkActive ? 'hide...' : 'more...'}
        </span>
      return <div key={key} style={{paddingLeft: '0.5em'}}>
        <NumberOrInf num={maxAllowed}/>
        times per {entry.timeFrame.interval} {entry.timeFrame.unit}
        {link}
        {linkActive ? <Triangle/> : null}
      </div>
    })}
  </div>

  let overall = details
    ? <>
        <div style={{width: 250, padding: '0.5em 0 0.5em 0.5em'}}>
          {main}
        </div>
        <div style={{flex: 1, backgroundColor: '#444', color: 'white', padding: '0.5em 0 0.5em 0.5em'}}>
          {details}
        </div>
      </>
    : <>
        <div style={{flex: 1, padding: '0.5em 0 0.5em 0.5em'}}>
          {main}
        </div>
      </>

  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  }}>
   {overall}
  </div>
}
