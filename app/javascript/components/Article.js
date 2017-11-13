import React from 'react'
import { array, object } from 'prop-types'
import { Link } from 'react-router-dom'
import MdEdit from 'react-icons/lib/md/edit'
import styled from 'styled-components'

const Article = ({ article, articles, authors }) => {
  const total = articles.length
  const tags = article.tags

  return (
    <ArticleWrapper>
      <header>
        <div>
          <div className="title-wrapper">
            <h2>{article.title}</h2>
            <Link to={`edit/${article.id_react}`}>
              <MdEdit />
            </Link>
          </div>
          {
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
            ? `/articles/${total}`
            : `/articles/${article.id_react - 1}`}
          >
            <button>Prev</button>
          </Link>
          <Link to={
            article.id_react === total
            ? `/articles/1`
            : `/articles/${article.id_react + 1}`}
          >
            <button>Next</button>
          </Link>
        </div>
      </header>
      <p>{article.content}</p>
      <ul>
        {
          tags.map((tag, index) => {
            return <Link className="tags" key={index} to={`/tags/${tag.name}`}><li>{tag.name}</li></Link>
          })
        }
      </ul>
      <ul>
        {
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

Article.propTypes = {
  article: object.isRequired,
  articles: array.isRequired,
  authors: array.isRequired
}

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
