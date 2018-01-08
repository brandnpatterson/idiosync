import React from 'react'
import { array, object, string } from 'prop-types'
import { Link } from 'react-router-dom'
import MdEdit from 'react-icons/lib/md/edit'
import styled from 'styled-components'

const propTypes = {
  article: object,
  articlesByQuarter: array.isRequired,
  authors: array.isRequired,
  quarter: string,
  year: string.isRequired
}

const Article = ({ article, articlesByQuarter, authors, quarter, year }) => {
  const total = articlesByQuarter.length
  const tags = article.tags

  const filtered = authors.map(author => {
    return articlesByQuarter.filter(article => {
      if (article.author_id === author.id) {
        return article
      }
    })
  })
  
  console.log(filtered)

  return (
    <ArticleWrapper>
      <header>
        <div>
          <div className="title-wrapper">
            <h2>{article.title}</h2>
            <Link to={`/${year}/Q${quarter}/${article.id_react}/edit`}>
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
            ? `/${year}/Q${quarter}/${total}`
            : `/${year}/Q${quarter}/${article.id_react - 1}`}
          >
            <button>Prev</button>
          </Link>
          <Link to={
            article.id_react === total
            ? `/${year}/Q${quarter}/1`
            : `/${year}/Q${quarter}/${article.id_react + 1}`}
          >
            <button>Next</button>
          </Link>
        </div>
      </header>
      <p>{article.content}</p>
      <ul>
        {
          tags.map((tag, index) => {
            return <Link className="tags" key={index} to={`/${year}/Q${quarter}/${tag.name}`}><li>{tag.name}</li></Link>
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
