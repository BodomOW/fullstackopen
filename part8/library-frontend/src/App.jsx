import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client/react'
import { Routes, Route, Link } from 'react-router-dom'

import { ALL_AUTHORS, ALL_BOOKS } from './queries'

import Notify from './components/Notify'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <>
      <header>
        <nav>
          <Link to="/authors">Authors</Link>
          <Link to="/books">Books</Link>
          {!token ? null : <Link to="/add">Add Book</Link>}
        </nav>
        <div className="user-section">
          {!token
            ? <LoginForm setToken={setToken} setError={notify} />
            : <button onClick={onLogout}>logout</button>
          }
        </div>
      </header>

      <Notify errorMessage={errorMessage} />

      <div className="container">
        <Routes>
          <Route path="/authors" element={<Authors authors={authorsResult.data.allAuthors} token={token} />} />
          <Route path="/books" element={<Books books={booksResult.data.allBooks} />} />
          <Route path="/add" element={<NewBook />} />
          <Route index element={<Authors authors={authorsResult.data.allAuthors} token={token} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
