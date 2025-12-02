import { useSelector } from 'react-redux'
import Notification from './Notification'

const Header = () => {
  const user = useSelector(state => state.login)

  return (
    <>
      {user === null
        ? <h2>log in to application</h2>
        : <h2>blog app</h2>
      }
      <Notification />
    </>
  )
}

export default Header