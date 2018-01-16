import React from 'react'
import { Link } from 'react-router-dom'

const ArchiveList = ({ quarters }) => {
  return (
    <div>
      <h2>Archive</h2>
      <ul>
        {quarters.map(q => {
          return <li key={q.id}><Link to={`/a/${q.value}`}>{q.value}</Link></li>
        })}
      </ul>
    </div>
  )
}

export default ArchiveList
