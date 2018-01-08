import React from 'react'
import { Link } from 'react-router-dom'

const ArchiveList = () => {

  return (
    <div>
      <h2>Archive</h2>
      <ul>
        <li><Link to="/a/2017-Q4">2017-Q4</Link></li>
      </ul>
    </div>
  )
}

export default ArchiveList
