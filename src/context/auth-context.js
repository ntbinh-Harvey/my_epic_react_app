/** @jsxImportSource @emotion/react */

import React from "react";
import { useQueryClient } from "react-query";
import { client } from "utils/api-client";
import { useAsync } from "utils/hooks";
import { FullPageSpinner } from "components/lib";
import * as colors from "styles/colors";
import * as auth from "auth-provider";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const queryClient = useQueryClient();
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
  const register = (form) => auth.register(form).then((user) => setData(user));
  // .catch((error) => Promise.reject(error));
  const logout = () => {
    auth.logout();
    queryClient.clear();
    setData(null);
  };
  const getUser = React.useCallback(async () => {
    let user = null;
    const token = await auth.getToken();
    if (token) {
      const data = await client("me", { queryClient, token });
      user = data.user;
    }
    return user;
  }, [queryClient]);
  React.useEffect(() => {
    run(getUser());
  }, [getUser, run]);
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
    const value = { user, login, register, logout };
    return (
      <AuthContext.Provider value={value} {...props}>{props.children}</AuthContext.Provider>
    );
  }
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthContext Provider");
  }
  return context;
}

function useClient() {
    const {user: {token}} = useAuth();
    return React.useCallback((endpoint, config) => client(endpoint, {...config, token}), [token])
}

export { AuthProvider, useAuth, useClient };
