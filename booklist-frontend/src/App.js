import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from './queries';
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Reccommendations from './components/Recommendations';
import Notify from './components/Notification';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const booksResult = useQuery(ALL_BOOKS)
  const authorsResult = useQuery(ALL_AUTHORS)
  const userResult = useQuery(CURRENT_USER)
  const client = useApolloClient()

  const updateCache = (addedBook) => {
    const isIncluded = (set, item) => 
      set.map(i => i.id).includes(item.id)
  
    const dataInCache = client.readQuery({ query: ALL_BOOKS })
    if (!isIncluded(dataInCache.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInCache.allBooks.concat(addedBook)}
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`A new book: "${addedBook.title}" was added successfully!`)

      updateCache(addedBook)
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('booklists-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const padding = {
    padding: 5
  }

  const logout = () => {
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

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <div>
        <Link style={padding} to="/">Authors</Link>
        <Link style={padding} to="/books">Books</Link>
        {!token
          ? <Link style={padding} to="/login">Login</Link>
          : <>
            <Link style={padding} to='/recommendations'>Reccommendations</Link>
            <Link style={padding} to="/add">Add Book</Link>
            <button onClick={logout}>Log out</button>
          </>
        }
      </div>

      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path='/' element={<Authors authors={authorsResult.data.allAuthors} token={token} />} />
        <Route path='/books' element={<Books books={booksResult.data.allBooks} />} />
        <Route
          path='/recommendations'
          element={<Reccommendations 
            books={booksResult.data.allBooks}
            user={userResult.data.me}
          />} />
        <Route path='/add' element={<NewBook setError={notify} updateCache={updateCache} />} />
        <Route
          path='login'
          element= {!token
            ? <LoginForm setToken={setToken} setError={setErrorMessage} />
            : <Navigate replace to="/" />
          } 
        />
      </Routes>

    </>
  )
}

export default App
