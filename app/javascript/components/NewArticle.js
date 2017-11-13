import React, { Component } from 'react'
import { array, bool, func } from 'prop-types'
import { Link } from 'react-router-dom'
import MdEdit from 'react-icons/lib/md/edit'
import axios from 'axios'
import styled from 'styled-components'

import NewArticleForm from './themes/Form'
import NotFound from './NotFound'

const req = 'http://localhost:3000/api/v1/articles'

class NewArticle extends Component {
  constructor () {
    super()
    this.state = {
      author_id: '',
      content: '',
      new_article: false,
      tag_list: '',
      title: ''
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  postArticle = (e) => {
    e.preventDefault()
    const articleObj = {
      title: this.state.title,
      content: this.state.content,
      author_id: this.state.author_id,
      tag_list: this.state.tag_list,
      new_article: this.state.new_article
    }
    axios.post(req, articleObj)
      .then(() => {
        this.setState({
          title: '',
          content: '',
          author_id: '',
          tag_list: '',
          new_article: true
        })
      })
      .then(() => {
        window.scrollTo(0, 0)
        this.props.getRequest()
      })
      .catch(err => console.log(err))
  }

  setActiveAuthor = (id) => {
    this.setState({
      author_id: id
    })
  }

  setActiveTags = (e) => {
    let data = e.target.dataset
    if (data.active === 'false') {
       data.active = 'true'
       this.setState({
         tag_list: `${this.state.tag_list} ${e.target.value}, `
       })
    } else {
      data.active = 'false'
    }
    e.target.classList.toggle('active')

  }

  render () {
    const {
      title,
      content,
      author_id,
      tag_list,
      new_article
    } = this.state
    const { authors, tags, flash_create, flash_delete, flash_update } = this.props

    const authorButtons = authors
      .sort((a, b) => {
        const aUpper = a.name.toUpperCase()
        const bUpper = b.name.toUpperCase()

        if (aUpper < bUpper) return -1
        if (aUpper > bUpper) return 1
        return 0
      })
      .map((a, index) => (
        <div className="author-button"
          key={index}
          >
          <button
            onClick={() => this.setActiveAuthor(a.id)}
            className={author_id === a.id ? 'active' : ''}
            name="author"
            value={a.name}
            type="button"
          >
            {a.name}
          </button>
          <Link to={`authors/edit/${a.id_react}`}>
            <MdEdit />
          </Link>
        </div>
    ))

    const tagsButtons = tags
      .sort((a, b) => {
        const aUpper = a.name.toUpperCase()
        const bUpper = b.name.toUpperCase()

        if (aUpper < bUpper) return -1
        if (aUpper > bUpper) return 1
        return 0
      })
      .map((t, index) => (
        <div className="tag-button"
          key={index}
          >
          <button
            data-active="false"
            onClick={this.setActiveTags}
            name="author"
            value={t.name}
            type="button"
          >
            {t.name}
          </button>
        </div>
    ))

    return (
      <NewArticleWrapper>
        {this.props.authenticated === true
        ? <NewArticleForm
            onSubmit={this.postArticle}
            method="post"
            autoComplete="off"
          >
            {new_article && (
              <div className="flash-message">
                <h4>Article created successfully!</h4>
              </div>
            )}
            {flash_create && (
              <div className="flash-message">
                <h4>Author created successfully!</h4>
              </div>
            )}
            {flash_delete && (
              <div className="flash-message">
                <h4>Author deleted successfully!</h4>
              </div>
            )}
            {flash_update && (
              <div className="flash-message">
                <h4>Author updated successfully!</h4>
              </div>
            )}
            <div className="formgroup">
              <h2>New Article</h2>
            </div>
            <div className="formgroup">
              <label htmlFor="title"> Title:
                <input name="title" value={title} onChange={this.onChange} type="text" autoFocus required />
              </label>
            </div>
            <div className="formgroup">
              <label htmlFor="content"> Content:
                <textarea name="content" value={content} onChange={this.onChange} required />
              </label>
            </div>
            <div className="formgroup">
              <label htmlFor="chooseTags">
                <div>
                  <h2>Choose Tags:</h2>
                  <div className="tag-buttons-wrapper">
                    {tagsButtons}
                  </div>
                </div>
              </label>
            </div>
            <div className="tag_list formgroup">
              <label htmlFor="tag_list"> Tags: (Seperate with commas)
                <input name="tag_list" value={tag_list} onChange={this.onChange} type="text" required />
              </label>
            </div>
            <div className="formgroup">
              <label htmlFor="chooseAuthor">
                <div>
                  <h2>Choose Author:</h2>
                  <div className="author-buttons-wrapper">
                    {authorButtons}
                  </div>
                </div>
              </label>
            </div>
            <div className="formgroup">
              <input className="post-data button" name="create-article" type="submit" value="Create Article" />
            </div>
          </NewArticleForm>
        : <NotFound />}
      </NewArticleWrapper>
    )
  }
}

NewArticle.propType = {
  articles: array.isRequired,
  authenticated: bool.isRequired,
  authors: array.isRequired,
  tags: array.isRequired,
  flash_create: bool.isRequired,
  flash_delete: bool.isRequired,
  flash_update: bool.isRequired,
  getRequest: func.isRequired
}

const NewArticleWrapper = styled.div `
  .hidden {
    display: none;
  }
  .visible {
    display: block;
  }
  textarea {
    height: 10em;
  }
  .flash-message {
    text-align: center;
    border: 1px solid green;
    border-radius: 10px;
  }
  .form-group {
    margin: 20px 0;
  }
  .active {
    border-color: green;
  }
  .author-buttons-wrapper {
    .author-button {
      border: 1px solid whitesmoke;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      button {
        margin: 1em;
      }
      svg {
        color: gray;
        margin: 14px;
      }
    }
  }
  .tag-buttons-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin: 0 auto;
    .tag-button {
      margin: 1em 1.5em 0 0;
    }
  }
`

export default NewArticle
