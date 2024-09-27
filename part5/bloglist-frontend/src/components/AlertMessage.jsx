import PropTypes from 'prop-types'

const AlertMessage = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.status}>
      {message.text}
    </div>
  )
}

AlertMessage.propTypes = {
  message: PropTypes.object
}

AlertMessage.displayName = 'AlertMessage'

export default AlertMessage