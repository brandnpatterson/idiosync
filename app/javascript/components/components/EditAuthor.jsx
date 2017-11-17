import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { func, object } from 'prop-types'
import axios from 'axios'
import styled from 'styled-components'

import EditAuthorForm from './themes/Form'
import DeleteAuthorForm from './themes/Form'

const req = '/api/v1/authors'

const propTypes = {
  author: object.isRequired,
  deleteFlashConfirmation: func.isRequired,
  updateFlashConfirmation: func.isRequired,
  getRequest: func.isRequired
}

class EditAuthor extends Component {
  constructor () {
    super()
    this.state = {
      id: '',
      name: '',
      bio: '',
      fireRedirect: false
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  componentWillMount () {
    const { author } = this.props
    this.setState({
      id: author.id,
      name: author.name,
      bio: author.bio
    })
  }

  setStateAndProps = () => {
    this.setState({
      fireRedirect: true
    })
    this.props.getRequest()
  }

  editAuthor = (e) => {
    e.preventDefault()

    const {
      id,
      name,
      bio
    } = this.state

    const authorObj = {
      name,
      bio
    }
    axios.put(`${req}/${id}`, authorObj)
      .then(() => {
        this.setStateAndProps()
        this.props.updateFlashConfirmation()
      })
      .catch(err => console.log(err))
    setTimeout(() => {
      this.props.updateFlashConfirmation()
    }, 2000)
  }

  deleteAuthor = (e) => {
    e.preventDefault()

    this.props.deleteFlashConfirmation()
    axios.delete(`${req}/${this.state.id}`)
      .then(() => {
        this.setStateAndProps()
      })
      .catch(err => console.log(err))
    setTimeout(() => {
      this.props.deleteFlashConfirmation()
    }, 2000)
  }

  render () {
    const {
      name,
      bio,
      fireRedirect
    } = this.state
    const { author, from } = this.props || '/'

    return (
      <EditAuthorWrapper>
        <EditAuthorForm
          onSubmit={this.editAuthor}
          method="get"
          autoComplete="off"
        >
          <div className="formgroup">
            <h2>Edit {author.name}</h2>
          </div>
          <div className="formgroup">
            <label htmlFor="create-author"> Name:
              <input name="name" value={name} onChange={this.onChange} type="text" />
            </label>
            <label htmlFor="bio"> Bio:
              <textarea name="bio" value={bio} onChange={this.onChange} />
            </label>
          </div>
          <div className="formgroup">
            <input className="button" name="create-author" type="submit" value="Submit Changes" />
          </div>
          {/* Redirect */}
          {fireRedirect && (
            <Redirect to={from || '/new-article'} />
          )}
        </EditAuthorForm>
        {/* Delete Author */}
        <DeleteAuthorForm
          onSubmit={this.deleteAuthor}
          method="delete"
        >
          <div className="formgroup">
            <input className="button button-delete" name="delete-author" type="submit" value="Delete" />
          </div>
        </DeleteAuthorForm>
      </EditAuthorWrapper>
    )
  }
}

EditAuthor.propTypes = propTypes

const EditAuthorWrapper = styled.div`
  margin: 0 auto;
  width: 70%;
  header {
    display: flex;
    justify-content: space-between;
  }
  button {
    margin: 1.5em 0 0 0.5em;
  }
  .tags {
    color: blue;
  }
`

export default EditAuthor
