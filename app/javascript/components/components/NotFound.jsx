import React, { Component } from 'react';
import { Redirect } from 'react-router'

class NotFound extends Component {
  render () {
    const { from } = this.props || '/'
    return (
      <Redirect to={from || '/'} />
    )
  }
}

export default NotFound
