import { useQuery, useQueryClient } from "react-query";
import { client } from "utils/api-client";
import bookPlaceholderSvg from "assets/book-placeholder.svg";

const loadingBook = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: bookPlaceholderSvg,
  publisher: "Loading Publishing",
  synopsis: "Loading...",
  loadingBook: true,
};

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}));
const getBookSearchConfig = (queryClient, query, user) => ({
  queryKey: ["bookSearch", { query }],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data) => data.books),
  onSuccess: (books) => {
    for (const book of books) {
      setQueryDataForBook(queryClient, book);
    }
  },
});
function useBookSearch(query, user) {
  const queryClient = useQueryClient();
  const results = useQuery(getBookSearchConfig(queryClient, query, user));

  return { ...results, books: results.data ?? loadingBooks };
}

function useBook(bookId, user) {
  const results = useQuery({
    queryKey: ["book", { bookId }],
    queryFn: () =>
      client(`books/${bookId}`, { token: user.token }).then(
        (data) => data.book
      ),
  });
  return { ...results, book: results.data ?? loadingBook };
}

function refetchBookSearchQuery(queryClient, user) {
  queryClient.removeQueries("bookSearch");
  queryClient.prefetchQuery(getBookSearchConfig(queryClient, "", user));
}

function setQueryDataForBook(queryClient, book) {
  queryClient.setQueryData(["book", { bookId: book.id }], book);
}
export { useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook };
