import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  author {
    name
  }
  published
  genres
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const SELECT_GENRE = gql`
query selectGenre($genre: String!) {
  allBooks(genre: $genre) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const CURRENT_USER = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

export const CREATE_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation editYear($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
    bookCount
    id
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`