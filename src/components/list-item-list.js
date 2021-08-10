/** @jsxImportSource @emotion/react */

// 🐨 you'll need useQuery from 'react-query'
// 🐨 and client from 'utils/api-client'
import { useListItems } from "utils/list-items";
import { Profiler } from "components/profiler";
import { BookListUL } from "./lib";
import { BookRow } from "./book-row";

function ListItemList({ filterListItems, noListItems, noFilteredListItems }) {
  // 🐨 call useQuery to get the list-items from the 'list-items' endpoint
  // queryKey should be 'list-items'
  // queryFn should call the 'list-items' endpoint
  const listItems = useListItems();
  // 🐨 assign this to the list items you get back from react-query

  const filteredListItems = listItems.filter(filterListItems);

  if (!listItems?.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>{noListItems}</div>
    );
  }
  if (!filteredListItems.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>
        {noFilteredListItems}
      </div>
    );
  }

  return (
    <Profiler id="List Item List" metadata={{ listItemCount: filteredListItems.length }}>
      <BookListUL>
        {filteredListItems.map((listItem) => (
          <li key={listItem.id}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </BookListUL>
    </Profiler>
  );
}

export { ListItemList };
