const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  console.log('Text:', message.text)
  console.log('Status:', message.status)

  return (
    <div className={message.status}>
      {message.text}
    </div>
  )
}

export default Notification