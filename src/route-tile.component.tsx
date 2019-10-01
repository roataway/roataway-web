import React from 'react'
import './Tab.css'

const tab = props => {
  return (
    <div className="Tab">
      <p>
        I'm a tab named {props.title} and my favourite number is {Math.random()}
      </p>
      <p>{props.children}</p>
      <p onClick={props.click}>clickable</p>
      <input type="text" onChange={props.changed} value={props.title} />
    </div>
  )
}

export default tab
