import { Link } from "react-router-dom"
// import { useSelector, useDispatch } from 'react-redux'

// import { clearUser } from '../reducers/loginReducer'

const Navbar = () => {

  return (
    <>
      <nav>
        <Link to="/">Blogs</Link>
        <Link to="/users">Users</Link>
      </nav>
      {/* <p>{login.user.name} logged in <button onClick={handleLogout}>logout</button></p> */}
    </>
  )
}

export default Navbar