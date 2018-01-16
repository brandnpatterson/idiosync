import React from 'react'
import { Link } from 'react-router-dom'
import { array, bool, func, string } from 'prop-types'
import styled from 'styled-components'
import MdSearch from 'react-icons/lib/md/search'

const propTypes = {
  authenticated: bool.isRequired,
  changeQuarter: func.isRequired,
  filteredArticles: array.isRequired,
  getRequest: func.isRequired,
  logout: func.isRequired,
  quarter: string,
  search: string.isRequired,
  updateSearch: func.isRequired
}

const Header = ({ authenticated, changeQuarter, filteredArticles, logout, quarter, search, updateSearch }) => {
  const testForMatch = e => {
    filteredArticles.map(article => {
      if (e.target.innerHTML === article.title) {
        changeQuarter(article.id_quarter)
      }
    })
  }

  return (
    <Nav>
      <ul className="left">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/a">Archive</Link></li>
      </ul>
      <ul className="right">
        <li>
          <SearchInput autoComplete="off">
            <input
              className="search__input"
              type="text"
              onChange={updateSearch}
              placeholder="Search"
              value={search}
            />
            <ul className="search__result">
              {filteredArticles.map(article => (
                <Link
                  className={"search__result--item" + (search === '' ? " hidden" : '')}
                  key={article.id}
                  onClick={testForMatch}
                  to={`/${article.id_quarter}/${article.id_react}`}
                >
                  <li>{article.title}</li>
                </Link>
              ))}
            </ul>
            <MdSearch className="search__icon" />
          </SearchInput>
        </li>
      </ul>
      {
        authenticated === true
        ? <ul className="right">
          <li><Link to="/new-article">New Article</Link></li>
            <li><Link to="/new-author">New Author</Link></li>
            <li onClick={logout}><Link to="/">Log Out</Link></li>
          </ul>
        : <ul className="right">
            <li><Link to="/login">Log In</Link></li>
          </ul>
      }
    </Nav>
  )
}

Header.propTypes = propTypes

const Nav = styled.nav `
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-around;
  padding: 1em 0;
  margin: 0 auto;
  a {
    text-decoration: none;
  }
  .left {
    justify-content: space-around;
    max-width: 30em;
  }
  .right {
    justify-content: space-around;
    max-width: 25em;
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 100%;
    a {
      color: black;
      font-size: 1em;
    }
  }
`

const SearchInput = styled.div`
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

export default Header
