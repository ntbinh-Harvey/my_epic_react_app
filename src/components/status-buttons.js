/** @jsxImportSource @emotion/react */
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from "react-icons/fa";
import Tooltip from "@reach/tooltip";
import { useMutation, useQueryClient } from "react-query";
import {useAuth} from 'context/auth-context'
import { useListItem, useUpdateListItem } from "utils/list-items";
import { client } from "utils/api-client";
import { useAsync } from "utils/hooks";
import * as colors from "styles/colors";
import { CircleButton, Spinner } from "./lib";

// eslint-disable-next-line react/prop-types
function TooltipButton({ label, highlight, onClick, icon, ...rest }) {
  const { isLoading, isError, error, run, reset } = useAsync();

  function handleClick() {
    if (isError) {
      reset();
    } else {
      run(onClick());
    }
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: "white",
          ":hover,:focus": {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  );
}

function StatusButtons({ book }) {
  const {user} = useAuth()
  const queryClient = useQueryClient();
  const listItem = useListItem(book.id);

  const { mutateAsync: update } = useUpdateListItem();
  const { mutateAsync: remove } = useMutation(
    ({ id }) =>
      client(`list-items/${id}`, { method: "DELETE", token: user.token }),
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );
  const { mutateAsync: create } = useMutation(
    ({ bookId }) =>
      client("list-items", { data: { bookId }, token: user.token }),
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );

  return (
    <>
      {listItem ? (
        // eslint-disable-next-line no-extra-boolean-cast
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() => update({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() => update({ id: listItem.id, finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({ id: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({ bookId: book.id })}
          // 🐨 add an onClick here that calls create
          icon={<FaPlusCircle />}
        />
      )}
    </>
  );
}

export { StatusButtons };
