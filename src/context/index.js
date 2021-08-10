import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "context/auth-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.status === 404) return false;
        else if (failureCount < 2) return true;
        else return false;
      },
    },
  },
});
function AuthProviders({ children }) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>{children}</AuthProvider>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position="top-left" />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export { AuthProviders };
