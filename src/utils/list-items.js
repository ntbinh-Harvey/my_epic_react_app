import { useQuery, useMutation, useQueryClient } from "react-query";
import { setQueryDataForBook } from "./books";
import { client } from "utils/api-client";

function useListItems(user) {
  const queryClient = useQueryClient();
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      client("list-items", { token: user.token }).then(
        (data) => data.listItems
      ),
    onSuccess: (listItems) => {
      for (const listItem of listItems) {
        setQueryDataForBook(queryClient, listItem.book);
      }
    },
  });
  return listItems ?? [];
}

function useListItem(user, bookId) {
  const listItems = useListItems(user);
  return listItems.find((item) => item.bookId === bookId) ?? null;
}

function useUpdateListItem(user, ...options) {
  const queryClient = useQueryClient();
  return useMutation(
    (updates) =>
      client(`list-items/${updates.id}`, {
        method: "PUT",
        data: updates,
        token: user.token,
      }),
    {
      onSettled: () => queryClient.invalidateQueries("list-items"),
      onMutate: (newItem) => {
        const previousItems = queryClient.getQueryData("list-items");

        queryClient.setQueryData("list-items", (old) => {
          return old.map((item) => {
            return item.id === newItem.id ? { ...item, ...newItem } : item;
          });
        });

        return () => queryClient.setQueryData("list-items", previousItems);
      },
      onError: (err, variables, recover) =>
        typeof recover === "function" ? recover() : null,
      ...options,
    }
  );
}

function useRemoveListItem(user, ...options) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) =>
      client(`list-items/${id}`, { method: "DELETE", token: user.token }),
    {
      onSettled: () => queryClient.invalidateQueries("list-items"),
      onMutate: (removedItem) => {
        const previousItems = queryClient.getQueryData("list-items");

        queryClient.setQueryData("list-items", (old) => {
          return old.filter((item) => item.id !== removedItem.id);
        });

        return () => queryClient.setQueryData("list-items", previousItems);
      },
      onError: (err, variables, recover) =>
        typeof recover === "function" ? recover() : null,
      ...options,
    }
  );
}

function useCreateListItem(user, ...options) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ bookId }) =>
      client("list-items", { data: { bookId }, token: user.token }),
    {
      onSettled: () => queryClient.invalidateQueries("list-items"),
      onError: (err, variables, recover) =>
        typeof recover === "function" ? recover() : null,
      ...options,
    }
  );
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
