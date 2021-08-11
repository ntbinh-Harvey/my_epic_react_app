/** @jsxImportSource @emotion/react */
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa';
import Tooltip from '@reach/tooltip';
import { trace } from 'components/profiler';
import {
  useListItem, useUpdateListItem, useRemoveListItem, useCreateListItem,
} from 'utils/list-items';
import { useAsync } from 'utils/hooks';
import * as colors from 'styles/colors';
import { CircleButton, Spinner } from './lib';

// eslint-disable-next-line react/prop-types
function TooltipButton({
  label, highlight, onClick, icon, ...rest
}) {
  const {
    isLoading, isError, error, run, reset,
  } = useAsync();

  function handleClick() {
    if (isError) {
      reset();
    } else {
      trace(`Click ${label}`, performance.now(), () => run(onClick()));
    }
  }

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
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
  const listItem = useListItem(book.id);

  const { mutateAsync: update } = useUpdateListItem();
  const { mutateAsync: remove } = useRemoveListItem();
  const { mutateAsync: create } = useCreateListItem();

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

export default StatusButtons;
