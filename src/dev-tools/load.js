/* eslint-disable no-use-before-define */
function loadDevTools(callback) {
  // check URL first
  const url = new URL(window.location);
  const setInUrl = url.searchParams.has('dev-tools');
  const urlEnabled = url.searchParams.get('dev-tools') === 'true';
  if (setInUrl) {
    if (urlEnabled) {
      return go();
    }
    return callback();
  }

  // the check localStorage
  const localStorageValue = window.localStorage.getItem('dev-tools');
  const setInLocalStorage = localStorageValue != undefined;
  const localStorageEnabled = localStorageValue === 'true';
  if (setInLocalStorage) {
    if (localStorageEnabled) {
      return go();
    }
    return callback();
  }

  // the default is off in Cypress
  if (window.Cypress) return callback();

  // the default is on in development
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'development') return go();

  return callback();

  function go() {
    // use a dynamic import so the dev-tools code isn't bundled with the regular
    // app code so we don't worry about bundle size.
    import('./dev-tools')
      .then((devTools) => devTools.install())
      .finally(callback);
  }
}

export default loadDevTools;

/*
eslint
  eqeqeq: "off",
*/
