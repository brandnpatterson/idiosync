import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { array, bool, string } from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

const propTypes = {
  articlesByQuarter: array,
  authors: array.isRequired,
  flash_delete: bool.isRequired,
  flash_update: bool.isRequired,
  quarter: string,
  tagsByQuarter: array.isRequired,
  year: string.isRequired
}

class Articles extends Component {
  componentWillMount () {
    const { changeQuarter, getRequest, year } = this.props

    if (moment().format('M') === '1' || moment().format('M') === '2' || moment().format('M') === '3') {
      changeQuarter(`${year}-1`)
    } else if (moment().format('M') === '4' || moment().format('M') === '5' || moment().format('M') === '6') {
      changeQuarter(`${year}-2`)
    } else if (moment().format('M') === '7' || moment().format('M') === '8' || moment().format('M') === '9') {
      changeQuarter(`${year}-3`)
    } else if (moment().format('M') === '10' || moment().format('M') === '11' || moment().format('M') === '12') {
      changeQuarter(`${year}-4`)
    }

    setTimeout(() => {
      getRequest()
    }, 0)
  }

  render () {
    const { articlesByQuarter, authors, tagsByQuarter, flash_delete, flash_update, quarter, year } = this.props
    
    console.log(articlesByQuarter)
    return (
      <ArticlesWrapper>
        <div className="outer">
          {flash_delete && (
            <div className="flash-message">
              <h4>Article deleted successfully!</h4>
            </div>
          )}
          {flash_update && (
            <div className="flash-message">
              <h4>Article updated successfully!</h4>
            </div>
          )}
          <h2 className="title">IDIOSYNC</h2>
          <img className="landing" src="https://pbs.twimg.com/media/CIcACTPUsAAkPfn.jpg:large" alt="" />
          <h2 className="title">Make Unicorns Great Again</h2>
          <div className="inner">
            <div>
              {tagsByQuarter.map((tag, tagIndex) => (
                <div key={tagIndex}>
                <h2>{tag.name}</h2>
                {articlesByQuarter.map((article, articleIndex) => {
                  return article.tags.map(articleTag => {
                    return articleTag.id === tag.id
                      ? <div key={articleIndex}>
                        <ul>
                          <li className="author">
                            {authors.map(author => {
                              return author.id === article.author_id ? author.name : ''
                            })}
                          </li>
                          <li className="title">
                            <Link to={`/${year}/Q${quarter}/${article.id_react}`}>{article.title}</Link>
                          </li>
                        </ul>
                      </div>
                      : null
                  })
                })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ArticlesWrapper>
    )
  }
}
Articles.propTypes = propTypes

const ArticlesWrapper = styled.div `
  background: whitesmoke;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
  margin: 5em auto;
  max-width: 50em;
  width: 80%;
  .outer {
    padding: 2em 0;
    .flash-message {
      text-align: center;
      border: 1px solid green;
      border-radius: 10px;
    }
    h2.title {
      font-size: 2.3em;
      text-align: center;
    }
    .inner {
      margin: 5em auto;
      max-width: 30em;
      width: 80%;
      h2,
      hr {
        margin: 0;
      }
      ul {
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 0;
        li {
          margin: 0 1em;
          width: 100%;
        }
        .author {
          text-align: right;
        }
        .title {
          font-style: italic;
          text-align: left;
        }
      }
    }
    .landing {
      margin: 0 auto;
      display: block;
      width: 300px;
    }
  }
`

export default Articles