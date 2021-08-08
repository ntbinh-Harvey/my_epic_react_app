// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app
import { authFirebase } from "utils/firebase";
const localStorageKey = "firebase_provider_token";

async function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse({user}) {
  window.localStorage.setItem(localStorageKey, user.refreshToken);
  return user;
}

function login({ username, password }) {
  // return client('login', {username, password}).then(handleUserResponse)
  return authFirebase
    .signInWithEmailAndPassword(username, password)
    .then(handleUserResponse)
    .catch(error => Promise.reject(error));
}

function register({ username, password }) {
  // return client('register', {username, password}).then(handleUserResponse)
  return authFirebase
    .createUserWithEmailAndPassword(username, password)
    .then(handleUserResponse)
    .catch(error => Promise.reject(error));
}
async function logout() {
  authFirebase.signOut()
  window.localStorage.removeItem(localStorageKey);
}

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
// const authURL = process.env.REACT_APP_AUTH_URL

// async function client(endpoint, data) {
//   const config = {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {'Content-Type': 'application/json'},
//   }

//   return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
//     console.log('response', response);

//     const data = await response.json()
//     if (response.ok) {
//       return data
//     } else {
//       return Promise.reject(data)
//     }
//   })
// }

export { getToken, login, register, logout, localStorageKey };
