import { useQuery } from '@apollo/client/react'
import { Routes, Route, Link } from 'react-router-dom'

import { ALL_AUTHORS } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading...</div>
  }

  console.log(result.data)

  return (
    <>
      <nav>
        <Link to="/authors">Authors</Link>
        <Link to="/books">Books</Link>
        <Link to="/add">Add Book</Link>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/authors" element={<Authors authors={result.data.allAuthors} />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route index element={<Authors authors={result.data.allAuthors} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
