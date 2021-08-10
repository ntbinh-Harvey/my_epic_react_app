import { Authenticated } from "screens/Authenticated";
import { Unauthenticated } from "screens/Unauthenticated";
import { useAuth } from "context/auth-context";

function App() {
  const { user } = useAuth();
  return user ? <Authenticated /> : <Unauthenticated />;
}

export default App;
