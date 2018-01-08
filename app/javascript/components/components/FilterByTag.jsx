import React from 'react'
import { array, object, string } from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const propTypes = {
  authors: array.isRequired,
  filterByTag: array.isRequired,
  match: object.isRequired,
  quarter: string,
  year: string.isRequired
}

const FilterByTag = ({ authors, filterByTag, match, quarter, year }) => {
  const filteredArticles = []
    
  filterByTag.map(itemToFilter => {
    return itemToFilter.filter(f => {
      if (f !== null) {
        return filteredArticles.push(f)
      } else {
        return false
      }
    })
  })

  return (
    <FilterByTagWrapper>
      <div className="outer">
        <h2 className="title">{match.params.tagName}</h2>
        <div className="inner">
          <h2>Articles</h2>
          <hr />
          {
            filteredArticles.map((article, index) => (
              <ul key={index}>
                <li className="author">
                  { authors.map(author => {
                    return author.id === article.author_id ? author.name : ''
                  })}
                </li>
                <li className="title">
                  <Link to={`/${year}/Q${quarter}/${article.id_react}`}>{article.title}</Link>
                </li>
              </ul>
            ))
          }
        </div>
      </div>
    </FilterByTagWrapper>
  )
}
FilterByTag.propTypes = propTypes

const FilterByTagWrapper = styled.div `
  background: whitesmoke;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
  margin: 5em auto;
  max-width: 50em;
  width: 80%;
  .outer {
    padding: 2em 0;
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

export default FilterByTag
