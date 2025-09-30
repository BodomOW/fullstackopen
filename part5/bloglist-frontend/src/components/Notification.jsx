import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)

  if (message === null) return null

  return (
    <div className={message.status}>
      {message.text}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.object
}

Notification.displayName = 'Notification'

export default Notification