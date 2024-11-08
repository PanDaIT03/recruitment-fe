import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useRef } from 'react';

import { MessageProvider } from './contexts/MessageProvider';
import { useAppDispatch } from './hooks/useStore';
import AppRouter from './routes/AppRouter';
import { getMe } from './store/thunk/auth';
import toast from './utils/functions/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const flagRef = useRef(false);
  const dispatch = useAppDispatch();
  const queryClient = new QueryClient();

  const token = localStorage.getItem('token1');
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  useEffect(() => {
    if (!token) return;

    if (!flagRef.current) {
      dispatch(getMe());
      flagRef.current = true;
    }
  }, [token]);

  if (!clientId) {
    toast.error('Google Client ID is missing!');
    return <div>Error: Google Client ID is not set.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <MessageProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </MessageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
