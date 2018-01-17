import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import axios from 'axios'
import moment from 'moment'
import styled from 'styled-components'

import Archive from './Archive'
import ArchiveList from './ArchiveList'
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

const landingImg = 'images/landing.jpg'

const reqArticles = '/api/v1/articles'
const reqAuthors = '/api/v1/authors'
const reqSession = '/api/v1/sessions'

const dev = 22
const prod = 33
let location = prod

class App extends Component {
  constructor () {
    super()
    this.state = {
      articles: [],
      articlesByQuarter: [],
      authenticated: false,
      authors: null,
      fireRedirect: false,
      confirm_delete: false,
      flash_create: false,
      flash_delete: false,
      flash_update: false,
      email: '',
      password: '',
      quarter: null,
      quarters: null,
      search: '',
      tags: [],
      tagsByQuarter: [],
      year: moment().format('YYYY')
    }
  }

  componentWillMount () {
    this.setState({
      quarter: window.location.href.substr(location, 6)
    }, () => {
      this.getRequest()
    })

    let localAuth = localStorage.getItem('authenticated')
    if (localAuth === 'true') {
      this.setState({
        authenticated: true
      })
    }
  }

  getRequest = () => {
    const { articles, quarter } = this.state
    
    axios.get(reqAuthors)
      .then(res => {
        const authors = res.data
        authors.forEach((a, index) => a.id_author = index + 1)
        this.setState({ authors })
      })
      .catch(err => console.log(err))
    axios.get(reqArticles)
      .then(res => {
        const articlesNotInQuarter = []
        const articlesPreQuarter = res.data
        const articlesByQuarter = []
        const tagsPreQuarter = []
        
        articlesPreQuarter.forEach((article, index) => {
          article.tags.forEach((tag, index) => {
            const el = tagsPreQuarter.filter((el) => {
              return el.id === tag.id
            })
            if (el.length) {
              el[0].IsChecked = tag.checked;
            } else {
              tagsPreQuarter.push(tag)
              this.setState({
                tags: tagsPreQuarter
              })
            }
          })
        })

        articlesPreQuarter.filter((article, index) => {
          if (~article.created_at.indexOf('-01') || ~article.created_at.indexOf('-02') || ~article.created_at.indexOf('-03')) {
            article.id_quarter = `${moment(article.created_at).format('YYYY')}-1`
          } else if (~article.created_at.indexOf('-04') || ~article.created_at.indexOf('-05') || ~article.created_at.indexOf('-06')) {
            article.id_quarter = `${moment(article.created_at).format('YYYY')}-2`
          } else if (~article.created_at.indexOf('-07') || ~article.created_at.indexOf('-08') || ~article.created_at.indexOf('-09')) {
            article.id_quarter = `${moment(article.created_at).format('YYYY')}-3`
          } else if (~article.created_at.indexOf('-10') || ~article.created_at.indexOf('-11') || ~article.created_at.indexOf('-12')) {
            article.id_quarter = `${moment(article.created_at).format('YYYY')}-4`
          }
          
          if (article.id_quarter === quarter) {
            articlesByQuarter.push(article)
            articlesByQuarter.forEach((article, quarterIndex) => {
              article.id_react = quarterIndex + 1
            })
          } else if (article.id_quarter !== quarter) {
            articlesNotInQuarter.push(article)
            articlesNotInQuarter.forEach((article, quarterIndex) => {
              article.id_react = quarterIndex + 1
            })
          }
        })
        this.setState({ articlesByQuarter: articlesByQuarter })
        this.setState({ articles: articlesPreQuarter })
        this.setTagsByQuarter()
        this.gatherAllQuarters()
      })
      .catch(err => console.log(err))
  }

  setTagsByQuarter = () => {
    const { articlesByQuarter, tags } = this.state
    const tagsArr = []

    articlesByQuarter.forEach(article => {
      article.tags.forEach((tag, index) => {
        const el = tagsArr.filter((el) => {
          return el.id === tag.id
        })
        if (el.length) {
          el[0].IsChecked = tag.checked;
        } else {
          tagsArr.push(tag)
          this.setState({
            tagsByQuarter: tagsArr
          })
        }
      })
    })
  }

  setQuarter = () => {
    const { year } = this.state
    if (moment().format('M') === '1' || moment().format('M') === '2' || moment().format('M') === '3') {
      this.changeQuarter(`${year}-1`)
    } else if (moment().format('M') === '4' || moment().format('M') === '5' || moment().format('M') === '6') {
      this.changeQuarter(`${year}-2`)
    } else if (moment().format('M') === '7' || moment().format('M') === '8' || moment().format('M') === '9') {
      this.changeQuarter(`${year}-3`)
    } else if (moment().format('M') === '10' || moment().format('M') === '11' || moment().format('M') === '12') {
      this.changeQuarter(`${year}-4`)
    }
  }

  changeQuarter = (setQuarter) => {
    this.setState({
      quarter: setQuarter
    }, () => this.getRequest())
  }

  gatherAllQuarters = () => {
    const { articles } = this.state

    const quarterArr = [];

    articles.map(article => {
      quarterArr.push(article.id_quarter);
    })

    let quartersFromSet = [...new Set(quarterArr)];
    let quarters = [];

    for (let i = 0; i < quartersFromSet.length; i++) {
      quarters.push({
        id: i,
        value: quartersFromSet[i]
      })
    }

    this.setState({ quarters })
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
          fireRedirect: true,
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
    window.location.reload()
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

  render () {

    const {
      articles,
      articlesByQuarter,
      authenticated,
      authors,
      confirm_delete,
      fireRedirect,
      flash_create,
      flash_delete,
      flash_update,
      quarter,
      quarters,
      search,
      tags,
      tagsByQuarter
    } = this.state
    const { from } = this.props || '/'

    let filteredArticles = []
    
    if (search !== '') {
      filteredArticles = articles.filter(article => {
        return article.title.toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
      })
    }

    filteredArticles.length = 4

    return (
      <AppWrapper>
        <div onClick={this.resetSearch}>
          <Header
            articles={articles}
            authenticated={authenticated}
            changeQuarter={this.changeQuarter}
            filteredArticles={filteredArticles}
            getRequest={this.getRequest}
            logout={this.logout}
            quarter={quarter}
            search={search}
            updateSearch={this.updateSearch}
          />
        </div>
        <Switch>
          { /* Articles */ }
          {articles && authors && tags && (
            <Route exact path="/" render={() => {
              return <Articles
                articlesByQuarter={articlesByQuarter}
                changeQuarter={this.changeQuarter}
                authors={authors}
                flash_delete={flash_delete}
                flash_update={flash_update}
                getRequest={this.getRequest}
                quarter={quarter}
                setQuarter={this.setQuarter}
                tagsByQuarter={tagsByQuarter}
              />
            }} />
          )}
          {fireRedirect && (
            <Redirect to={from || '/'} />
          )}
          { /* Log In */}
          <Route exact path="/login" render={() => {
            return <Login
              authenticated={authenticated}
              email={this.state.email}
              login={this.login}
              password={this.state.password}
              updateEmail={this.updateEmail}
              updatePassword={this.updatePassword}
            />
          }} />
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
            <Route path={`/${quarter}/:id/edit`} render={({ match }) => {
              return (
                <EditArticle
                  article={articlesByQuarter.find(a => a.id_react === parseInt(match.params.id, 10))}
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
          { /* Article/:id */ }
          {quarter && articlesByQuarter && authors && tags && (
            <Route path={`/${quarter}/:id`} render={({ match }) => {
              return (
                <Article
                  article={articlesByQuarter.find(a => a.id_react === parseInt(match.params.id, 10))}
                  articlesByQuarter={articlesByQuarter}
                  authors={authors}
                  changeQuarter={this.changeQuarter}
                  getRequest={this.getRequest}
                  quarter={quarter}
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
                  author={authors.find(a => a.id_author === parseInt(match.params.id, 10))}
                  deleteFlashConfirmation={this.deleteFlashConfirmation}
                  updateFlashConfirmation={this.updateFlashConfirmation}
                  getRequest={this.getRequest}
                  confirm_delete={confirm_delete}
                  deleteConfirmation={this.deleteConfirmation}
                />
              )
            }} />
          )}
          { /* ArchiveList */}
          <Route exact path="/submissions" component={Submissions} />
          {quarters && articles && authors && tags && (
            <Route exact path="/archive" render={() => {
              return <ArchiveList
                articles={articles}
                authors={authors}
                flash_delete={flash_delete}
                flash_update={flash_update}
                quarters={quarters}
                tags={tags}
              />
            }} />
          )}
          { /* ArchiveList/:archive */}
          {articles && authors && tags && (
            <Route exact path="/:archive" render={({ match }) => {
              return <Archive
                articlesByQuarter={articlesByQuarter}
                authors={authors}
                changeQuarter={this.changeQuarter}
                flash_delete={flash_delete}
                getRequest={this.getRequest}
                flash_update={flash_update}
                match={match}
                quarter={quarter}
                tagsByQuarter={tagsByQuarter}
              />
            }} />
          )}
          { /* Tags/:tagName */ }
          {articles && authors && tags && (
            <Route path={`/tags/:tagName`} render={({ match }) => {
              return (
                <FilterByTag
                  authors={authors}
                  changeQuarter={this.changeQuarter}
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
                  quarter={quarter}
                />
              )
            }} />
          )}
          {/* NotFound */}
          {quarter && articles && authors && tags && (
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
