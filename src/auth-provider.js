// import { authFirebase } from "utils/firebase";
const localStorageKey = "__auth_provider_token__";

async function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

async function handleUserResponse({ user }) {
  // user.token = await user.getIdToken();
  window.localStorage.setItem(localStorageKey, user.token);
  return user;
}

function login({ username, password }) {
  return client("login", { username, password }).then(handleUserResponse);
  // return authFirebase
  //   .signInWithEmailAndPassword(username, password)
  //   .then(handleUserResponse)
  //   .catch(error => Promise.reject(error));
}

function register({ username, password }) {
  return client("register", { username, password }).then(handleUserResponse);
  // return authFirebase
  //   .createUserWithEmailAndPassword(username, password)
  //   .then(handleUserResponse)
  //   .catch(error => Promise.reject(error));
}
async function logout() {
  // authFirebase.signOut()
  window.localStorage.removeItem(localStorageKey);
}
const authURL = process.env.REACT_APP_AUTH_URL;

async function client(endpoint, data) {
  const config = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  return window
    .fetch(`${authURL}/${endpoint}`, config)
    .then(async (response) => {
      console.log("response", response);

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export { getToken, login, register, logout, localStorageKey };
