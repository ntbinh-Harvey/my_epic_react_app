/* eslint-disable no-undef */
// 🐨 here are the things you're going to need for this test:
// import faker from 'faker';
import App from 'App';
import {
  render, screen, waitForLoadingToFinish, userEvent, loginAsUser,
} from 'test/app-test-utils';
import { buildBook, buildListItem } from 'test/generate';
import * as booksDB from 'test/data/books';
import * as listItemsDB from 'test/data/list-items';
import formatDate from 'utils/misc';

// jest.mock('components/profiler');
beforeEach(() => jest.useRealTimers());

async function renderBookScreen() {
  const book = await booksDB.create(buildBook());
  const route = `/book/${book.id}`;
  await render(<App />, { route });
  return { book };
}

test('renders all the book information', async () => {
  // const user = await loginAsUser();
  const { book } = await renderBookScreen();
  // const originalFetch = window.fetch;
  // window.fetch = async (url, config) => {
  //   if (url.endsWith('/bootstrap')) {
  //     return { ok: true, json: async () => ({ user: { ...user, token: user.token }, listItems: [] }) };
  //   }

  //   if (url.endsWith(`/books/${book.id}`)) {
  //     return { ok: true, json: async () => ({ book }) };
  //   }
  //   console.log(url, config);

  //   return originalFetch(url, config);
  // };
  expect(screen.getByRole('heading', { name: book.title })).toBeInTheDocument();
  expect(screen.getByText(book.author)).toBeInTheDocument();
  expect(screen.getByText(book.publisher)).toBeInTheDocument();
  expect(screen.getByText(book.synopsis)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /book cover/i })).toHaveAttribute(
    'src',
    book.coverImageUrl,
  );
  expect(screen.getByRole('button', { name: /add to list/i })).toBeInTheDocument();

  expect(
    screen.queryByRole('button', { name: /remove from list/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /mark as read/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /mark as unread/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('textbox', { name: /notes/i }),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole('radio', { name: /star/i })).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument();
});

test('can add book to list item', async () => {
  await renderBookScreen();
  const addToListBtn = screen.getByRole('button', { name: /add to list/i });
  userEvent.click(addToListBtn);
  await waitForLoadingToFinish();
  expect(screen.getByRole('button', { name: /mark as read/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /remove from list/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
  const getDate = screen.getByLabelText(/start date/i);
  expect(getDate).toHaveTextContent(formatDate(new Date()));
  expect(screen.queryByRole('button', { name: /add to list/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /unmark as read/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('radio', { name: /star/i })).not.toBeInTheDocument();
});

// test('can remove a list item for the book', async () => {
//   const user = await loginAsUser();

//   const book = await booksDB.create(buildBook());
//   await listItemsDB.create(buildListItem({ owner: user, book }));
//   const route = `/book/${book.id}`;

//   await render(<App />, { route, user });

//   const removeFromListButton = screen.getByRole('button', {
//     name: /remove from list/i,
//   });
//   userEvent.click(removeFromListButton);
//   expect(removeFromListButton).toBeDisabled();

//   await waitForLoadingToFinish();

//   expect(screen.getByRole('button', { name: /add to list/i })).toBeInTheDocument();

//   expect(
//     screen.queryByRole('button', { name: /remove from list/i }),
//   ).not.toBeInTheDocument();
// });

// test('can mark a list item as read', async () => {
//   const user = await loginAsUser();
//   const book = await booksDB.create(buildBook());
//   const listItem = await listItemsDB.create(buildListItem({ owner: user, book, finishDate: null }));
//   const route = `/book/${book.id}`;
//   await render(<App />, { route, user });
//   const markAsReadBtn = screen.getByRole('button', { name: /mark as read/i });
//   userEvent.click(markAsReadBtn);
//   expect(markAsReadBtn).toBeDisabled();
//   await waitForLoadingToFinish();
//   expect(
// screen.getByRole('button', {name: /mark as unread/i}),
// ).toBeInTheDocument()
// expect(screen.getAllByRole('radio', {name: /star/i})).toHaveLength(5)

// const startAndFinishDateNode = screen.getByLabelText(/start and finish date/i)
// expect(startAndFinishDateNode).toHaveTextContent(
//   `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
// )

// expect(
//   screen.queryByRole('button', {name: /mark as read/i}),
// ).not.toBeInTheDocument()

// });

// test('can edit a note', async () => {
//   jest.useFakeTimers();
//   const user = await loginAsUser();
//   const book = await booksDB.create(buildBook());
//   const listItem = await listItemsDB.create(buildListItem({ owner: user, book }));
//   const route = `/book/${book.id}`;
//   await render(<App />, { route, user });

//   const newNotes = faker.lorem.words();
//   const notesTextarea = screen.getByRole('textbox', { name: /notes/i });

//   userEvent.clear(notesTextarea);
//   userEvent.type(notesTextarea, newNotes);

//   await screen.findByLabelText(/loading/i);
//   await waitForLoadingToFinish();

//   expect(notesTextarea).toHaveValue(newNotes);

//   expect(await listItemsDB.read(listItem.id)).toMatchObject({
//     notes: newNotes,
//   });
// });
