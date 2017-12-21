import React from 'react'
import { Link } from 'react-router-dom'

const ArchiveList = () => {

  return (
    <div>
      <h2>Archive</h2>
      <ul>
        <li><Link to="/a/2017">2017-12</Link></li>
        <li><Link to="/a/2018">2018-1</Link></li>
      </ul>
    </div>
  )
}

export default ArchiveList
