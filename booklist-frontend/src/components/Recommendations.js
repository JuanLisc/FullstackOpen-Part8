import { useQuery } from '@apollo/client'
import { SELECT_GENRE } from '../queries'

const Reccommendations = ({ user }) => {
  const result = useQuery(SELECT_GENRE, {
    variables: { genre: user.favoriteGenre }
  })

  if (!result.called || result.loading) {
    return <div>loading...</div>
  }

  const booksToRecommend = result.data.allBooks

  return (
    <>
    <h2>Reccommendations</h2>
    <h4>Hi, {user.username}!</h4>
    <p>Here it is a list of books of your favorite genre: <strong>{user.favoriteGenre}</strong></p>

    <table>
        <tbody>
          <tr>
            <th>Book</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToRecommend.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Reccommendations