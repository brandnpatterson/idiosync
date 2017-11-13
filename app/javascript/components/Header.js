import React from 'react'
import { Link } from 'react-router-dom'
import { array, bool, func, string } from 'prop-types'
import styled from 'styled-components'
import Search from './Search'

const Header = ({ authenticated, filteredArticles, logout, search, updateSearch }) => {
  return (
    <Nav>
      <ul className="left">
        <li><Link to="/">Idiosync</Link></li>
        <li><Link to="/articles">Articles</Link></li>
        <li><Link to="/tags">Tags</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <ul className="right">
        <li><Search
              filteredArticles={filteredArticles}
              search={search}
              updateSearch={updateSearch}
            />
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

Header.propTypes = {
  authenticated: bool.isRequired,
  filteredArticles: array.isRequired,
  logout: func.isRequired,
  search: string.isRequired,
  updateSearch: func.isRequired
}

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
    max-width: 20em;
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

export default Header
