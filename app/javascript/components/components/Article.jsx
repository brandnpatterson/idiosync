import React from 'react'
import { array, func, object, string } from 'prop-types'
import { Link } from 'react-router-dom'
import MdEdit from 'react-icons/lib/md/edit'
import styled from 'styled-components'

const propTypes = {
  article: object,
  articlesByQuarter: array.isRequired,
  authors: array.isRequired,
  getRequest: func.isRequired,
  quarter: string.isRequired
}

const Article = ({ article, articlesByQuarter, authenticated, authors, getRequest, match, quarter }) => {
  const total = articlesByQuarter.length
  let tags
  if (article) {
    tags = article.tags
  }
  
  return (
    <ArticleWrapper>
      {article &&
        <div>
          <header>
            <div>
              <div className="title-wrapper">
                <h2>{article.title}</h2>
                {authenticated &&
                  <Link to={`/${quarter}/${article.id_react}/edit`}>
                    <MdEdit />
                  </Link>
                }
              </div>
              {authors &&
                authors.map(author => {
                  if (author.id === article.author_id) {
                    return <h3 key={author.id}>{author.name}</h3>
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
          <p dangerouslySetInnerHTML={{__html: article.content}}></p>
          <ul>
            {tags &&
              tags.map((tag) => {
                return <Link className="tags" key={tag.id} to={`/tags/${tag.name}`}><li>{tag.name}</li></Link>
              })
            }
          </ul>
          <ul>
            {authors &&
              authors.map(author => {
                if (author.id === article.author_id) {
                  return <h2 key={author.id}>{author.bio}</h2>
                } else {
                  return null
                }
              })
            }
          </ul>
        </div>
      }
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
