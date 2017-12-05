import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

import Archive from './Archive'
import Archives from './Archives'
import Article from './Article'
import Articles from './Articles'
import EditArticle from './EditArticle'
import EditAuthor from './EditAuthor'
import FilterByTag from './FilterByTag'
import Header from './Header'
import Login from './Login'
import NewArticle from './NewArticle'
import NewAuthor from './NewAuthor'
import NotFound from './NotFound'
import Submissions from './Submissions'
import Tags from './Tags'

const landingImg = 'images/landing.jpg'

const reqArticles = '/api/v1/articles'
const reqAuthors = '/api/v1/authors'
const reqSession = '/api/v1/sessions'

class App extends Component {
  constructor () {
    super()
    this.state = {
      articles: null,
      authenticated: true,
      authors: null,
      confirm_delete: false,
      flash_create: false,
      flash_delete: false,
      flash_update: false,
      email: '',
      password: '',
      search: '',
      tags: [],
      year: '2017'
    }
  }

  componentWillMount () {
    this.getRequest()

    let localAuth = localStorage.getItem('authenticated')
    
    if (localAuth === 'true') {
      this.setState({
        authenticated: true
      })
    }
  }

  getRequest = () => {
    const { year } = this.state
    
    axios.get(reqAuthors)
      .then(res => {
        const authors = res.data
        authors.filter(author => {
          if (author.created_at.startsWith(year)) {
            this.setState({ authors })
          }
        })
        setTimeout(() => {
          this.setTags()
        }, 20)
      })
      .catch(err => console.log(err))
    axios.get(reqArticles)
      .then(res => {
        const articles = res.data
        this.setState({ articles })
      })
      .catch(err => console.log(err))
  }

  setTags = () => {
    const { articles, tags } = this.state
    // access each article.tags to be used in tags state
    setTimeout(() => {
      articles.forEach(article => {
        article.tags.forEach(tag => {
          // article.tag => tags
          tags.push(tag)
          // reduce any duplicates
          const reducedTags = tags.reduce((first, second) => {
            // if the next object's id is not found in the output array
            if (!first.some((el) => {
              return el.id === second.id;
            }))
            // push the object into the output array
            first.push(second)
            return first
          }, [])
          this.setState({
            tags: reducedTags
          })
        })
      })
    }, 20)
  }

  setReactIds = () => {
    const { articles, authors } = this.state
    
    articles.filter((article, index) => {
      return article.id_react = index + 1
    })
  }

  // authentication
  login = (e) => {
    e.preventDefault()
    const { email, password } = this.state
    axios.post(reqSession, {
      email: email,
      password: password
    })
    .then(res => {
      if (res) {
        localStorage.setItem('email', this.state.email)
        this.setState({
          authenticated: true,
          email: '',
          password: ''
        })
        localStorage.setItem('authenticated', this.state.authenticated)
      }
    })
    .catch(err => console.log(err))
  }

  logout = () => {
    localStorage.setItem('authenticated', false)
    localStorage.setItem('email', '')

    this.setState({
      authenticated: false
    })
  }

  // search
  resetSearch = () => {
    if (this.state.search !== '') {
      this.setState({
        search: ''
      })
    }
  }

  updateSearch = (e) => {
    this.setState({
      search: e.target.value.substr(0, 20)
    })
  }

  // email -- password
  updateEmail = (e) => {
    this.setState({
      email: e.target.value.substr(0, 50)
    })
  }

  updatePassword = (e) => {
    this.setState({
      password: e.target.value.substr(0, 50)
    })
  }

  // delete confirmation
  deleteConfirmation = () => {
    if (this.state.confirm_delete === false) {
      this.setState({
        confirm_delete: true
      })
    } else {
      this.setState({
        confirm_delete: false
      })
    }
    setTimeout(() => {
      this.setState({
        confirm_delete: false
      })
    }, 6000)
  }

  // flash
  createFlashConfirmation = () => {
    if (this.state.flash_create === false) {
      this.setState({
        flash_create: true
      })
    } else {
      this.setState({
        flash_create: false
      })
    }
  }

  deleteFlashConfirmation = () => {
    if (this.state.flash_delete === false) {
      this.setState({
        flash_delete: true
      })
    } else {
      this.setState({
        flash_delete: false
      })
    }
  }

  updateFlashConfirmation = () => {
    if (this.state.flash_update === false) {
      this.setState({
        flash_update: true
      })
    } else {
      this.setState({
        flash_update: false
      })
    }
  }

  changeYear = (setYear) => {
    const { authors, year } = this.state

    this.setState({
      year: setYear
    })
  }

  render () {

    const {
      articles,
      authenticated,
      authors,
      confirm_delete,
      flash_create,
      flash_delete,
      flash_update,
      search,
      tags
    } = this.state

    let filteredArticles = []

    if (search !== '') {
      filteredArticles = articles.filter(article => {
        return article.title.toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
      })
    }

    filteredArticles.length = 3

    if (articles && authors) {
      this.setReactIds()
    }

    return (
      <AppWrapper>
        <div onClick={this.resetSearch}>
          <Header
            authenticated={authenticated}
            filteredArticles={filteredArticles}
            logout={this.logout}
            search={search}
            updateSearch={this.updateSearch}
          />
        </div>
        <Switch>
          { /* Articles */ }
          {articles && authors && tags && (
            <Route exact path="/" render={() => {
              return <Articles
                articles={articles}
                changeYear={this.changeYear}
                authors={authors}
                flash_delete={flash_delete}
                flash_update={flash_update}
                tags={tags}
              />
            }} />
          )}
          { /* New Article */ }
          {articles && authors && tags && (
            <Route exact path="/new-article" render={() => {
              return <NewArticle
                articles={articles}
                authenticated={authenticated}
                authors={authors}
                tags={tags}
                flash_create={flash_create}
                flash_delete={flash_delete}
                flash_update={flash_update}
                getRequest={this.getRequest}
              />
            }} />
          )}
          { /* Edit Article by :id */ }
          {articles && (
            <Route path="/articles/:id/edit" render={({ match }) => {
              return (
                <EditArticle
                  article={articles.find(a => a.id_react === parseInt(match.params.id, 10))}
                  articles={articles}
                  deleteFlashConfirmation={this.deleteFlashConfirmation}
                  updateFlashConfirmation={this.updateFlashConfirmation}
                  getRequest={this.getRequest}
                  confirm_delete={confirm_delete}
                  deleteConfirmation={this.deleteConfirmation}
                  tags={tags}
                />
              )
            }} />
          )}
          { /* Articles/:id */ }
          {articles && authors && (
            <Route path="/articles/:index" render={({ match }) => {
              return (
                <Article
                  article={articles.find(a => a.id_react === parseInt(match.params.index, 10))}
                  articles={articles}
                  authors={authors}
                />
              )
            }} />
          )}
          { /* New Author */ }
          {articles && authors && (
            <Route exact path="/new-author" render={() => {
              return <NewAuthor
                articles={articles}
                authenticated={authenticated}
                authors={authors}
                createFlashConfirmation={this.createFlashConfirmation}
                getRequest={this.getRequest}
              />
            }} />
          )}
          { /* Edit Author by :id */ }
          {authors && (
            <Route path="/authors/:id/edit" render={({ match }) => {
              return (
                <EditAuthor
                  author={authors.find(a => a.id_react === parseInt(match.params.id, 10))}
                  deleteFlashConfirmation={this.deleteFlashConfirmation}
                  updateFlashConfirmation={this.updateFlashConfirmation}
                  getRequest={this.getRequest}
                  confirm_delete={confirm_delete}
                  deleteConfirmation={this.deleteConfirmation}
                />
              )
            }} />
          )}
          { /* Tags */ }
          {articles && tags && (
            <Route exact path="/tags" render={() => {
              return <Tags articles={articles} tags={tags} />
            }} />
          )}
          { /* Tags/:tagName */ }
          {articles && authors && tags && (
            <Route path="/tags/:tagName" render={({ match }) => {
              return (
                <FilterByTag
                  authors={authors}
                  match={match}
                  tags={tags}
                  filterByTag={
                    articles.map(article => {
                      return article.tags.map(tag => {
                        if (tag.name === match.params.tagName) {
                          return article
                        } else {
                          return null
                        }
                      })
                    })
                  }
                />
              )
            }} />
          )}
          { /* Log In */ }
          <Route exact path="/login" render={() => {
            return <Login
              email={this.state.email}
              login={this.login}
              password={this.state.password}
              updateEmail={this.updateEmail}
              updatePassword={this.updatePassword}
            />
          }} />
          { /* Artichives */ }
          <Route exact path="/submissions" component={Submissions} />
          {articles && authors && tags && (
            <Route exact path="/a" render={() => {
              return <Archives
                articles={articles}
                authors={authors}
                flash_delete={flash_delete}
                flash_update={flash_update}
                tags={tags}
              />
            }} />
          )}
          { /* Archives/:archive */ }
          {articles && authors && tags && (
            <Route exact path="/a/:archive" render={({ match }) => {
              return <Archive
                articles={articles}
                authors={authors}
                changeYear={this.changeYear}
                flash_delete={flash_delete}
                getRequest={this.getRequest}
                flash_update={flash_update}
                match={match}
                tags={tags}
                year={parseInt(match.params.archive, 10)}
              />
            }} />
          )}
          {articles && authors && (
            <Route component={NotFound} />
          )}
        </Switch>
      </AppWrapper>
    )
  }
}

const Background = styled.img `
  width: 100%;
`
const AppWrapper = styled.div `
  font-family: serif;
  li {
    list-style-type: none;
    a {
      text-decoration: none;
    }
  }
  .button {
    appearance: none;
    background: green;
    border: none;
    border-radius: 0.25em;
    color: white;
    cursor: pointer;
    font-size: 1em;
    height: 2em;
    width: 100%;
  }
  .button.button-delete {
    background: red;
    margin: 2em auto;
    width: 25%;
  }
`

export default App
