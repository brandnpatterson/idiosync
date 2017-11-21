import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { func, object } from 'prop-types'
import axios from 'axios'
import styled from 'styled-components'

import EditArticleForm from './themes/Form'
import DeleteArticleForm from './themes/Form'

const req = '/api/v1/articles'

const propTypes = {
  article: object.isRequired,
  deleteFlashConfirmation: func.isRequired,
  updateFlashConfirmation: func.isRequired,
  getRequest: func.isRequired
}

class EditArticle extends Component {
  constructor () {
    super()
    this.state = {
      id: '',
      title: '',
      content: '',
      tags: '',
      fireRedirect: false
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  componentWillMount () {
    const { article } = this.props
    const tags = article.tags.map(tag => tag.name)

    this.setState({
      id: article.id,
      title: article.title,
      content: article.content,
      tags: tags
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
      content,
      tags
    } = this.state

    const articleObj = {
      title,
      content,
      tags
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

    axios.delete(`${req}/${this.state.id}`)
      .then(() => {
        this.setStateAndProps()
        this.props.deleteFlashConfirmation()
      })
      .catch(err => console.log(err))
    setTimeout(() => {
      this.props.deleteFlashConfirmation()
    }, 2000)
  }

  handleSelectDelete = () => {
    if (this.state.confirm_delete === false) {
      this.setState({
        confirm_delete: true
      })
      console.log(this.state.confirm_delete)
    } else {
      this.setState({
        confirm_delete: false
      })
    }
  }

  render () {
    const {
      title,
      content,
      tags,
      fireRedirect
    } = this.state
    const { article, from } = this.props || '/'

    return (
      <EditArticleWrapper>
          {/* Edit Article */}
          <EditArticleForm
            onSubmit={this.editArticle}
            method="get"
            autoComplete="off"
          >
          <div className="formgroup">
            <h2>Edit {article.title}</h2>
          </div>
          <div className="formgroup">
            <label htmlFor="title"> Title:
              <input name="title" value={title} onChange={this.onChange} type="text" autoFocus required />
            </label>
            <label htmlFor="content"> Content:
              <textarea name="content" value={content} onChange={this.onChange} rows="20" required />
            </label>
            <label htmlFor="tags"> Tags:
              <input name="tags" value={tags} onChange={this.onChange} type="text" required />
            </label>
          </div>
          <div className="formgroup">
            <input className="button" name="update-article" type="submit" value="Submit Changes" />
          </div>
          {/* Redirect */}
          {fireRedirect && (
            <Redirect to={from || '/'} />
          )}
        </EditArticleForm>
        {/* Delete Article */}
        <DeleteArticleForm
          onSubmit={this.deleteArticle}
          method="delete"
        >
          <div className="formgroup">
            <input className="button button-delete" name="delete-article" type="submit" value="Delete" />
          </div>
        </DeleteArticleForm>
      </EditArticleWrapper>
    )
  }
}
EditArticle.propTypes = propTypes

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
  .button-back {
    background: blue !important;
    margin-left: 30px;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

export default EditArticle
