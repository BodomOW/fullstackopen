import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      username
      <input
        data-testid='loginUsername'
        type="text"
        value={username}
        name="Username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      password
      <input
        data-testid='loginPassword'
        type="password"
        value={password}
        name="Password"
        onChange={handlePasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

LoginForm.displayName = 'LoginForm'

export default LoginForm