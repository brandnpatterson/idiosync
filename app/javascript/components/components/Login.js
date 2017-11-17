import React from 'react'
import { func, string } from 'prop-types'
import LoginForm from './themes/Form'

const propTypes = {
  email: string.isRequired,
  login: func.isRequired,
  password: string.isRequired,
  updateEmail: func.isRequired,
  updatePassword: func.isRequired
}

const Login = ({ email, login, password, updateEmail, updatePassword }) => {
  return (
    <LoginForm action="/articles" onSubmit={login} method="post">
      <div className="formgroup">
        <h2>Log In</h2>
      </div>
      <div className="formgroup">
        <label htmlFor="email"> Email:
          <input
            type="text" data-error="true" name="email"
            onChange={updateEmail}
            value={email}
            autoFocus
          />
        </label>
      </div>
      <div className="formgroup">
        <label htmlFor="password"> Password:
          <input
            type="password" data-error="true" name="password"
            onChange={updatePassword}
            value={password}
          />
        </label>
      </div>
      <div className="formgroup">
        <input
          className="post-data button"
          type="submit"
          name="submit"
          value="Log In"
        />
      </div>
    </LoginForm>
  )
}
Login.propTypes = propTypes

export default Login
