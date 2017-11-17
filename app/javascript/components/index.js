import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'

class Root extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
}

export default Root
