const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div className="error">
      {errorMessage}
    </div>
  )
}

export default Notify