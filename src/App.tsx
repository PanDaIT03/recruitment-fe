import { GoogleOAuthProvider } from '@react-oauth/google';

import AppRouter from './routes/AppRouter';
import toast from './utils/functions/toast';
import { MessageProvider } from './contexts/MessageProvider';
import { UserProvider } from './contexts/useContext';

function App() {
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  if (!clientId) {
    toast.error('Google Client ID is missing!');
    return <div>Error: Google Client ID is not set.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <MessageProvider>
          <AppRouter />
        </MessageProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
