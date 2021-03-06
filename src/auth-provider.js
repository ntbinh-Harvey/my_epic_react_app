const localStorageKey = '__auth_provider_token__';

async function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

async function handleUserResponse({ user }) {
  window.localStorage.setItem(localStorageKey, user.token);
  return user;
}

async function logout() {
  window.localStorage.removeItem(localStorageKey);
}
// eslint-disable-next-line no-undef
const authURL = process.env.REACT_APP_AUTH_URL;

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  return window
    .fetch(`${authURL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      return Promise.reject(data);
    });
}
function login({ username, password }) {
  return client('login', { username, password }).then(handleUserResponse);
}

function register({ username, password }) {
  return client('register', { username, password }).then(handleUserResponse);
}

export {
  getToken, login, register, logout, localStorageKey,
};
