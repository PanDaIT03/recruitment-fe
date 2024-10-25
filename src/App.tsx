import { GoogleOAuthProvider } from '@react-oauth/google';

import { MessageProvider } from './contexts/MessageProvider';
import AppRouter from './routes/AppRouter';
import toast from './utils/functions/toast';

function App() {
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  if (!clientId) {
    toast.error('Google Client ID is missing!');
    return <div>Error: Google Client ID is not set.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <MessageProvider>
        <AppRouter />
      </MessageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
