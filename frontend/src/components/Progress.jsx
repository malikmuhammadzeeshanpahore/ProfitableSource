import React from 'react'

export default function Progress({value=0}){
  return (
    <div className="progress" title={`${value}%`}>
      <i></i>
    </div>
  )
}
