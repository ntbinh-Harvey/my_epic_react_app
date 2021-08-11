import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from 'context/auth-context';
import { client } from 'utils/api-client';
import { setQueryDataForBook } from './books';

function useListItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: listItems } = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', { token: user.token }).then(
      (data) => data.listItems,
    ),
    onSuccess: (listItems) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const listItem of listItems) {
        setQueryDataForBook(queryClient, listItem.book);
      }
    },
  });
  return listItems ?? [];
}

function useListItem(bookId) {
  const listItems = useListItems();
  return listItems.find((item) => item.bookId === bookId) ?? null;
}

function useUpdateListItem(...options) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(
    (updates) => client(`list-items/${updates.id}`, {
      method: 'PUT',
      data: updates,
      token: user.token,
    }),
    {
      onSettled: () => queryClient.invalidateQueries('list-items'),
      onMutate: (newItem) => {
        const previousItems = queryClient.getQueryData('list-items');

        queryClient.setQueryData('list-items', (old) => old.map((item) => (item.id === newItem.id ? { ...item, ...newItem } : item)));

        return () => queryClient.setQueryData('list-items', previousItems);
      },
      onError: (err, variables, recover) => (typeof recover === 'function' ? recover() : null),
      ...options,
    },
  );
}

function useRemoveListItem(...options) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) => client(`list-items/${id}`, { method: 'DELETE', token: user.token }),
    {
      onSettled: () => queryClient.invalidateQueries('list-items'),
      onMutate: (removedItem) => {
        const previousItems = queryClient.getQueryData('list-items');

        queryClient.setQueryData('list-items', (old) => old.filter((item) => item.id !== removedItem.id));

        return () => queryClient.setQueryData('list-items', previousItems);
      },
      onError: (err, variables, recover) => (typeof recover === 'function' ? recover() : null),
      ...options,
    },
  );
}

function useCreateListItem(...options) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(
    ({ bookId }) => client('list-items', { data: { bookId }, token: user.token }),
    {
      onSettled: () => queryClient.invalidateQueries('list-items'),
      onError: (err, variables, recover) => (typeof recover === 'function' ? recover() : null),
      ...options,
    },
  );
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
