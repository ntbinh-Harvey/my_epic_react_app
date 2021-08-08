/** @jsxImportSource @emotion/react */
import { BrowserRouter as Router } from "react-router-dom";
import { FullPageSpinner } from "components/lib";
import { useAsync } from "utils/hooks";
import { Authenticated } from "screens/Authenticated";
import { Unauthenticated } from "screens/Unauthenticated";
import { useEffect } from "react";
import * as colors from "./styles/colors";
import * as auth from "auth-provider";
import { authFirebase } from "utils/firebase";

function App() {
  const {
    run,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    data: user,
    error,
    setData,
  } = useAsync();
  const login = (form) => auth.login(form).then((user) => setData(user));
  const register = (form) =>
    auth
      .register(form)
      .then((user) => {
        setData(user);
      })
      .catch((error) => Promise.reject(error));
  const logout = () => {
    auth.logout();
    setData(null);
  };
  useEffect(() => {
    authFirebase.onAuthStateChanged((user) => run(Promise.resolve(user)));
  }, [run]);
  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }
  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>There are some errors. Please try again</p>
        <pre>{error.message}</pre>
      </div>
    );
  }
  if (isSuccess) {
    const props = { user, login, register, logout };
    // 🐨 wrap the BrowserRouter around the AuthenticatedApp
    return user ? (
      <Router>
        <Authenticated {...props} />
      </Router>
    ) : (
      <Unauthenticated {...props} />
    );
  }
}

export default App;
