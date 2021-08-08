/** @jsxImportSource @emotion/react */

import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from 'components/lib'
import {BookRow} from 'components/book-row'
import {client} from 'utils/client'
import * as colors from 'styles/colors'
import {useAsync} from 'utils/hooks'
import {useState, useEffect} from 'react'

function DiscoverScreen({user}) {
  const {data, error, run, isLoading, isError, isSuccess} = useAsync()
  const [query, setQuery] = useState()
  const [queried, setQueried] = useState(false)

  useEffect(() => {
    if (!queried) {
      return
    }
    run(client(`books?query=${encodeURIComponent(query)}`, {token: user.token}))
  }, [query, queried, run, user.token])

  function handleSearchSubmit(event) {
    event.preventDefault()
    setQueried(true)
    setQuery(event.target.elements.search.value)
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>

      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverScreen}
