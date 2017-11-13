import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { func, object } from 'prop-types'
import axios from 'axios'
import styled from 'styled-components'

import EditArticleForm from './themes/Form'
import DeleteForm from './themes/Form'

const req = '/api/v1/articles'

class EditArticle extends Component {
  constructor () {
    super()
    this.state = {
      id: '',
      title: '',
      content: '',
      fireRedirect: false,
      delete_selected: false
    }
  }
  //
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  componentWillMount () {
    const { article } = this.props
    this.setState({
      id: article.id,
      title: article.title,
      content: article.content
    })
  }

  setStateAndProps = () => {
    this.setState({
      fireRedirect: true
    })
    this.props.getRequest()
  }

  editArticle = (e) => {
    e.preventDefault()
    const {
      id,
      title,
      content
    } = this.state

    const articleObj = {
      title,
      content
    }
    axios.put(`${req}/${id}`, articleObj)
      .then(() => {
        this.setStateAndProps()
        this.props.updateFlashConfirmation()
      })
      .catch(err => console.log(err))
    setTimeout(() => {
      this.props.updateFlashConfirmation()
    }, 2000)
  }

  deleteArticle = (e) => {
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

  handleSelectDelete = () => {
    if (this.state.delete_selected === false) {
      this.setState({
        delete_selected: true
      })
    } else {
      this.setState({
        delete_selected: false
      })
    }
  }

  render () {
    const {
      title,
      content,
      delete_selected,
      fireRedirect
    } = this.state
    const { article, from } = this.props || '/'

    return (
      <EditArticleWrapper>
        {
          !delete_selected && (
          <div>
            <EditArticleForm
              onSubmit={this.editArticle}
              method="get"
              autoComplete="off"
            >
              <div className="formgroup">
                <h2>Edit {article.title}</h2>
              </div>
              <div className="formgroup">
                <label htmlFor="create-article"> Title:
                  <input name="title" value={title} onChange={this.onChange} type="text" autoFocus required />
                </label>
                <label htmlFor="content"> Content:
                  <textarea name="content" value={content} onChange={this.onChange} rows="20" required />
                </label>
              </div>
              <div className="formgroup">
                <input className="button" name="create-article" type="submit" value="Submit Changes" />
              </div>
              <div className="delete-selected" onClick={this.handleSelectDelete}>
                <div className="formgroup">
                  <input className="button button-delete" name="delete-article" type="button" value="Delete" />
                </div>
              </div>
              {/* Redirect */}
              {fireRedirect && (
                <Redirect to={from || '/articles'} />
              )}
            </EditArticleForm>
          </div>
          )
        }
        {
          delete_selected && (
            <DeleteForm
              onSubmit={this.deleteArticle}
              method="delete"
            >
              <div className="formgroup">
                <h3>Are you sure you would like to delete {title}?</h3>
                <input className="button button-delete" name="delete-article" type="submit" value="Delete" />
              </div>
            </DeleteForm>
          )
        }
      </EditArticleWrapper>
    )
  }
}

EditArticle.propTypes = {
  article: object.isRequired,
  deleteFlashConfirmation: func.isRequired,
  updateFlashConfirmation: func.isRequired,
  getRequest: func.isRequired
}

const EditArticleWrapper = styled.div`
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

export default EditArticle
