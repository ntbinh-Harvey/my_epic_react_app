/* eslint-disable no-undef */
// 🐨 here are the things you're going to need for this test:
// import * as React from 'react'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from 'App';
import AppProviders from 'context';
import * as auth from 'auth-provider';
import { buildUser, buildBook } from 'test/generate';
import * as booksDB from 'test/data/books';
import * as usersDB from 'test/data/users';

test('renders all the book information', async () => {
  const user = buildUser();
  await usersDB.create(user);
  const userAuth = await usersDB.authenticate(user);
  window.localStorage.setItem(auth.localStorageKey, userAuth.token);
  // const originalFetch = window.fetch;
  // window.fetch = async (url, config) => {
  //   if (url.endsWith('/bootstrap')) {
  //     return { ok: true, json: async () => ({ user: { username: 'binh' }, listItems: [] }) };
  //   }
  //   return originalFetch(url, config);
  // };
  const book = await booksDB.create(buildBook());
  const route = `/book/${book.id}`;
  window.history.pushState({}, 'Test page', route);
  render(<App />, { wrapper: AppProviders });
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
  screen.debug();
});

// 🐨 create a user using `buildUser`
// 🐨 create a book use `buildBook`
// 🐨 update the URL to `/book/${book.id}`
//   💰 window.history.pushState({}, 'page title', route)
//   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState

// 🐨 reassign window.fetch to another function and handle the following requests:
// - url ends with `/bootstrap`: respond with {user, listItems: []}
// - url ends with `/list-items`: respond with {listItems: []}
// - url ends with `/books/${book.id}`: respond with {book}
// 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
// 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})

// 🐨 render the App component and set the wrapper to the AppProviders
// (that way, all the same providers we have in the app will be available in our tests)

// 🐨 use waitFor to wait for the queryCache to stop fetching and the loading
// indicators to go away
// 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitfor
// 💰 if (queryCache.isFetching or there are loading indicators) then throw an error...

// 🐨 assert the book's info is in the document
