import React from 'react'
import { array, object, string } from 'prop-types'
import { Link } from 'react-router-dom'
import MdEdit from 'react-icons/lib/md/edit'
import styled from 'styled-components'

const propTypes = {
  article: object,
  articlesByQuarter: array.isRequired,
  authors: array.isRequired,
  quarter: string.isRequired
}

const Article = ({ article, articlesByQuarter, authors, getRequest, match, quarter }) => {
  console.log(match)

  const total = articlesByQuarter.length
  const tags = article.tags
  
  return (
    <ArticleWrapper>
      <header>
        <div>
          <div className="title-wrapper">
            <h2>{article.title}</h2>
            <Link to={`/${quarter}/${article.id_react}/edit`}>
              <MdEdit />
            </Link>
          </div>
          {authors &&
            authors.map((author, index) => {
              if (author.id === article.author_id) {
                return <h3 key={index}>{author.name}</h3>
              } else {
                return null
              }
            })
          }
        </div>
        <div>
          <Link to={
            article.id_react === 1
            ? `/${quarter}/${total}`
            : `/${quarter}/${article.id_react - 1}`}
          >
            <button>Prev</button>
          </Link>
          <Link to={
            article.id_react === total
            ? `/${quarter}/1`
            : `/${quarter}/${article.id_react + 1}`}
          >
            <button>Next</button>
          </Link>
        </div>
      </header>
      <p>{article.content}</p>
      <ul>
        {tags &&
          tags.map((tag, index) => {
            return <Link className="tags" key={index} to={`/${tag.name}`}><li>{tag.name}</li></Link>
          })
        }
      </ul>
      <ul>
        {authors &&
          authors.map((author, index) => {
            if (author.id === article.author_id) {
              return <h2 key={index}>{author.bio}</h2>
            } else {
              return null
            }
          })
        }
      </ul>
    </ArticleWrapper>
  )
}
Article.propTypes = propTypes

const ArticleWrapper = styled.div`
  margin: 0 auto;
  width: 70%;
  header {
    display: flex;
    justify-content: space-between;
    .title-wrapper {
      display: flex;
      align-items: center;
      svg {
        margin: 0 0 0 0.5em;
      }
    }
  }
  button {
    margin: 1.5em 0 0 0.5em;
  }
  .tags {
    color: blue;
  }
`

export default Article
