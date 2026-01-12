import { useQuery } from '@apollo/client/react'
import { Routes, Route, Link } from 'react-router-dom'

import { ALL_AUTHORS, ALL_BOOKS } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  console.log(authorsResult.data)
  console.log(booksResult.data)

  return (
    <>
      <nav>
        <Link to="/authors">Authors</Link>
        <Link to="/books">Books</Link>
        <Link to="/add">Add Book</Link>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/authors" element={<Authors authors={authorsResult.data.allAuthors} />} />
          <Route path="/books" element={<Books books={booksResult.data.allBooks} />} />
          <Route path="/add" element={<NewBook />} />
          <Route index element={<Authors authors={authorsResult.data.allAuthors} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
