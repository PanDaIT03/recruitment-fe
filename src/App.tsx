import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { useEffect, useRef } from 'react';

import { MessageProvider } from './contexts/MessageProvider';
import { useAppDispatch } from './hooks/useStore';
import AppRouter from './routes/AppRouter';
import { getMe } from './store/thunk/auth';
import { getAllRoles } from './store/thunk/role';
import toast from './utils/functions/toast';

function App() {
  const flagRef = useRef(false);
  const dispatch = useAppDispatch();
  const queryClient = new QueryClient();

  const token = localStorage.getItem('token1');
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

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
      <AntApp>
        <MessageProvider>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
          </QueryClientProvider>
        </MessageProvider>
      </AntApp>
    </GoogleOAuthProvider>
  );
}

export default App;
