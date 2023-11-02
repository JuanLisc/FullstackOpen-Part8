import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { SELECT_GENRE } from '../queries'

const Books = ({ books }) => {
  const [filter, setFilter] = useState('all genres')
  const [loadingResult, result] = useLazyQuery(SELECT_GENRE, {
    variables: { genre: filter }
  })

  useEffect(() => {
    loadingResult()
  }, [loadingResult])

  let genres = ['all genres']

  books.forEach(book => 
    book.genres.map(genre =>
      genres.includes(genre) ? null : genres = genres.concat(genre)
    )
  )
  
  if (!result.called || result.loading) {
    return <div>loading...</div>
  }

  const filteredBooks = filter === 'all genres'
    ? books
    : result.data.allBooks

  const selectGenre = (value) => {
    setFilter(value)
    loadingResult()
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.map(genre => 
        <button key={genre} onClick={() => selectGenre(genre)}>{genre}</button>
      )}
    </div>
  )
}

export default Books
