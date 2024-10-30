import { GoogleOAuthProvider } from '@react-oauth/google';

import { MessageProvider } from './contexts/MessageProvider';
import AppRouter from './routes/AppRouter';
import toast from './utils/functions/toast';
import { useEffect, useRef } from 'react';
import { getMe } from '~/store/thunk/auth';
import { useAppDispatch } from '~/hooks/useStore.ts';

function App() {
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  const dispatch = useAppDispatch();
  const flagRef = useRef(false);

  if (!clientId) {
    toast.error('Google Client ID is missing!');
    return <div>Error: Google Client ID is not set.</div>;
  }

  useEffect(() => {
    const token = localStorage.getItem('token1');
    if (!token) return;

    if (!flagRef.current) {
      dispatch(getMe());
      flagRef.current = true;
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <MessageProvider>
        <AppRouter />
      </MessageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
