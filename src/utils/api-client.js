import * as auth from 'auth-provider';

const apiURL = process.env.REACT_APP_API_URL;
async function client(
  endpoint,
  {
    data, token, headers: customHeaders, ...customConfig
  } = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      // eslint-disable-next-line max-len
      // queryCache.clear(); // delete this cause Kent said that when we refresh, we will flush the cache anyway
      window.location.assign(window.location);
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: 'Please re-authenticate.' });
    }
    const dataReturn = await response.json();
    if (response.ok) {
      return dataReturn;
    }
    return Promise.reject(dataReturn);
  });
}

export default client;
