import React from 'react'
import { Link } from 'react-router-dom'
import { array, func, string } from 'prop-types'
import MdSearch from 'react-icons/lib/md/search'
import styled from 'styled-components'

const Search = ({ filteredArticles, search, updateSearch }) => {
  return (
    <SearchInput autoComplete="off">
      <input
        className="search__input"
        type="text"
        onChange={updateSearch}
        placeholder="Search"
        value={search}
      />
      <ul className="search__result">
        {filteredArticles.map((article, index) => (
          <Link
            className={"search__result--item" + (search === '' ? " hidden" : '')}
            key={index}
            to={`/articles/${article.id_react}`}
          >
            <li>{article.title}</li>
          </Link>
        ))}
      </ul>
      <MdSearch className="search__icon" />
    </SearchInput>
  )
}

Search.propTypes = {
  filteredArticles: array.isRequired,
  search: string.isRequired,
  updateSearch: func.isRequired
}

const SearchInput = styled.div `
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  @media (max-width: 700px) {
    margin-left: 3.2em;
  }
  .hidden {
    display: none;
  }
  .search {
    &__input {
      color: gray;
      font-size: 14px;
      height: 28px;
      margin-right: 0.5em;
      border: 1px solid #eee;
    }
    &__result {
      position: absolute;
      top: 3em;
      left: -2em;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
      &--item {
        background: white !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
        padding: 0.5em;
        width: 90%;
      }
      &--active {
        background: #f1f1f1;
      }
    }
    &__icon {
      color: gray;
      font-size: 22px;
    }
  }
`

export default Search
