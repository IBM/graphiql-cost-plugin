// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from 'react'

type Props = {
  title: string
  details: JSX.Element[]
}

export default function DetailsPopover(props: Props) {
  const [hover, setHover] = React.useState(false)

  if (!Array.isArray(props.details) || props.details.length === 0) {
    return null
  }

  const details = (
    <div>
      <h3
        style={{
          marginBlockStart: 0,
          marginBlockEnd: 0
        }}
      >
        {props.title}
      </h3>
      <ul style={{
        marginBlockStart: 5,
        marginBlockEnd: 5
      }}>
        {props.details.map((ex, i) => {
          return <li key={i}>{ex}</li>
        })}
      </ul>
    </div>
  )

  return (
    <span
      style={{
        marginLeft: '0.2rem',
        color: 'gray',
        borderBottom: '1px dotted gray',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      &#8505;
      <div style={{
        display: hover ? 'block' : 'none',
        zIndex: 1000,
        position: 'absolute',
        borderRadius: '5px',
        backgroundColor: '#111',
        color: 'white',
        bottom: 15,
        width: 'max-content',
        padding: 5,
        right: -50
      }}>
        {details}
      </div>
    </span>
  )
}
