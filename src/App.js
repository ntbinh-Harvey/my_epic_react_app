import React from 'react';
import { useAuth } from 'context/auth-context';
import { FullPageSpinner } from 'components/lib';

const Authenticated = React.lazy(() => import(/* webpackPrefetch: true */ 'screens/Authenticated'));
const Unauthenticated = React.lazy(() => import('screens/Unauthenticated'));
function App() {
  const { user } = useAuth();
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <Authenticated /> : <Unauthenticated />}
    </React.Suspense>
  );
}

export default App;
