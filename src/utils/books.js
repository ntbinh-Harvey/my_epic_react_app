import { useQuery, useQueryClient } from 'react-query';
import { useClient } from 'context/auth-context';
import bookPlaceholderSvg from 'assets/book-placeholder.svg';
import React from 'react';

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
};

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}));
function setQueryDataForBook(queryClient, book) {
  queryClient.setQueryData(['book', { bookId: book.id }], book);
}
const getBookSearchConfig = (queryClient, query, client) => ({
  queryKey: ['bookSearch', { query }],
  queryFn: () => client(`books?query=${encodeURIComponent(query)}`).then(
    (data) => data.books,
  ),
  onSuccess: (books) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const book of books) {
      setQueryDataForBook(queryClient, book);
    }
  },
});
function useBookSearch(query) {
  const client = useClient();
  const queryClient = useQueryClient();
  const results = useQuery(getBookSearchConfig(queryClient, query, client));

  return { ...results, books: results.data ?? loadingBooks };
}

function useBook(bookId) {
  const client = useClient();
  const results = useQuery({
    queryKey: ['book', { bookId }],
    queryFn: () => client(`books/${bookId}`).then((data) => data.book),
  });
  return { ...results, book: results.data ?? loadingBook };
}

function useRefetchBookSearchQuery() {
  const client = useClient();
  const queryClient = useQueryClient();
  return React.useCallback(async () => {
    queryClient.removeQueries('bookSearch');
    queryClient.prefetchQuery(getBookSearchConfig('', client));
  }, [client, queryClient]);
}

export {
  useBookSearch,
  useBook,
  useRefetchBookSearchQuery,
  setQueryDataForBook,
};
