import { useQuery, useMutation, useQueryClient } from "react-query";
import { client } from "utils/api-client";

function useListItems(user) {
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      client("list-items", { token: user.token }).then(
        (data) => data.listItems
      ),
  });
  return listItems ?? [];
}

function useListItem(user, bookId) {
  const listItems = useListItems(user);
  return listItems.find((item) => item.bookId === bookId) ?? null;
}

function useUpdateListItem(user) {
  const queryClient = useQueryClient();
  return useMutation(
    (updates) =>
      client(`list-items/${updates.id}`, {
        method: "PUT",
        data: updates,
        token: user.token,
      }),
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );
}

function useRemoveListItem(user) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) =>
      client(`list-items/${id}`, { method: 'DELETE', token: user.token }),
    {onSettled: () => queryClient.invalidateQueries('list-items')}
  );
}

function useCreateListItem(user) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ bookId }) =>
      client("list-items", { data: { bookId }, token: user.token }),
    {onSettled: () => queryClient.invalidateQueries('list-items')}
  );
}

export { useListItems, useListItem, useUpdateListItem, useRemoveListItem, useCreateListItem};
