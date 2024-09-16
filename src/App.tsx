import { GoogleOAuthProvider } from '@react-oauth/google';

import AppRouter from './routes/AppRouter';

function App() {
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  if (!clientId) {
    console.error('Google Client ID is missing!');
    return <div>Error: Google Client ID is not set.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppRouter />
    </GoogleOAuthProvider>
  );
}

export default App;
