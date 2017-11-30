import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { bool, func, object } from 'prop-types'
import axios from 'axios'
import styled from 'styled-components'

import EditArticleForm from './themes/Form'
import DeleteArticleForm from './themes/Form'

const req = '/api/v1/articles'

const propTypes = {
  article: object.isRequired,
  deleteFlashConfirmation: func.isRequired,
  updateFlashConfirmation: func.isRequired,
  getRequest: func.isRequired,
  confirm_delete: bool.isRequired,
  deleteConfirmation: func.isRequired
}

class EditArticle extends Component {
  constructor () {
    super()
    this.state = {
      id: '',
      title: '',
      content: '',
      tag_list: '',
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

    this.setState({
      id: article.id,
      title: article.title,
      content: article.content,
      tag_list: article.tags.map(tag => tag.name)
    })
  }

  setStateAndProps = () => {
    const { article } = this.props

    this.setState({
      fireRedirect: true,
      id: article.id,
      title: article.title,
      content: article.content,
      tag_list: article.tags
    })

    this.props.getRequest()
    this.props.updateFlashConfirmation()
  }

  editArticle = (e) => {
    e.preventDefault()

    const { id } = this.state
    
    const articleObj = {
      title: this.state.title,
      content: this.state.content,
      tag_list: this.state.tag_list
    }
    axios.put(`${req}/${id}`, articleObj)
      .then(() => {
        this.setStateAndProps()
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
        this.props.deleteConfirmation()
        this.props.deleteFlashConfirmation()
      })
      .catch(err => console.log(err))
    setTimeout(() => {
      this.props.deleteFlashConfirmation()
    }, 2000)
  }
  
  render () {
    const {
      title,
      content,
      tag_list,
      fireRedirect
    } = this.state
    const { article, confirm_delete, deleteConfirmation, from } = this.props || '/'
    
    return (
      <EditArticleWrapper>
          {/* Edit Article */}
          {!confirm_delete &&
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
                <label htmlFor="tag_list"> Tags:
                <input name="tag_list" value={tag_list} onChange={this.onChange} type="text" required />
                </label>
              </div>
              <div className="formgroup">
                <input className="button" name="update-article" type="submit" value="Submit Changes" />
              </div>
              <div className="formgroup">
                <input onClick={deleteConfirmation}
                  className="button button-delete"
                  name="confirm-delete-article" type="button" value="Delete" />
              </div>
            </EditArticleForm>
          }
        {/* Delete Article */}
        {confirm_delete &&
          <DeleteArticleForm
            onSubmit={this.deleteArticle}
            method="delete"
          >
            <div className="formgroup">
              <h2>Are you sure you would like to delete the following?</h2>
              <h2 className="confirm-delete-title">{title}</h2>
              <input className="button button-delete" name="delete-article" type="submit" value="Delete" />
            </div>
          </DeleteArticleForm>
        }
        {/* Redirect */}
        {fireRedirect && (
          <Redirect to={from || '/'} />
        )}
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
  .confirm-delete-title {
    margin-top: 20px;
    color: red;
  }
`

export default EditArticle
