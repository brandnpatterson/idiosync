import React from 'react'
import { Link } from 'react-router-dom'
import { array, bool } from 'prop-types'
import styled from 'styled-components'

const propTypes = {
  articles: array.isRequired,
  authors: array.isRequired,
  flash_delete: bool.isRequired,
  flash_update: bool.isRequired,
  tags: array.isRequired
}

const Articles = ({ articles, authors, flash_delete, flash_update, tagNames, tags }) => {

  const filterByTag = (number) => {
    let filteredTags = []

    filteredTags = articles.map(article => {
      return article.tags.map(tag => {
        if (tag.id === number) {
          return article
        } else {
          return null
        }
      })
    })

    const filteredArticles = []
    filteredTags.map(itemToFilter => {
      return itemToFilter.filter(f => {
        if (f !== null) {
          return filteredArticles.push(f)
        } else {
          return false
        }
      })
    })
    console.log(filteredArticles)
  }

  if (tags) {
    for (var i = 0; i < tags.lengh; i++) {
      console.log(i)
    }
  }

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
        <div className="inner">
          <h2>Articles</h2>
          <hr />
          <div>
            {
              articles.map((article, index) => {
                return (
                  <div key={index}>
                    <ul>
                      <li className="author">
                        {authors.map(author => {
                          return author.id === article.author_id ? author.name : ''
                        })}
                      </li>
                      <li className="title">
                        <Link to={`/articles/${article.id_react}`}>{article.title}</Link>
                      </li>
                    </ul>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </ArticlesWrapper>
  )
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
  }
`

export default Articles

 