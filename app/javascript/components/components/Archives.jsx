import React from 'react'
import { Link } from 'react-router-dom'

const Archives = () => {

  return (
    <div>
      <h2>Tacos</h2>
      <ul>
        <li><Link to="/a/2018">2018</Link></li>
        <li><Link to="/a/2019">2019</Link></li>
      </ul>
    </div>
  )
}

export default Archives
