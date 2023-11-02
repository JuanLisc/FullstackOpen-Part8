import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const YearForm = () => {
  const result = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  
  const [ changeYear ] = useMutation(EDIT_AUTHOR)
  
  const authors = result.data.allAuthors

  const submit = (event) => {
    event.preventDefault()

    changeYear({ variables: { name, setBornTo: Number(year) } })

    setYear('')
  }

  return (
    <div>
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Author
          <select id='name' onBlur={({ target }) => setName(target.value)}>
            {authors.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          Birth-year <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type='submit'>Set birth year</button>
      </form>
    </div>
  )
}

export default YearForm