import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { useEffect, useRef } from 'react';

import { BreadcrumbProvider } from './contexts/BreadcrumProvider';
import { MessageProvider } from './contexts/MessageProvider';
import { TitleProvider } from './contexts/TitleProvider';
import { useAppDispatch } from './hooks/useStore';
import useToken from './hooks/useToken';
import AppRouter from './routes/AppRouter';
import { getMe } from './store/thunk/auth';
import toast from './utils/functions/toast';

function App() {
  const flagRef = useRef(false);
  const { token } = useToken();
  const dispatch = useAppDispatch();

  const queryClient = new QueryClient();
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;

  useEffect(() => {
    if (!flagRef.current) {
      if (token) dispatch(getMe());
      flagRef.current = true;
    }
  }, [token]);

  useEffect(() => {
    if (!clientId) {
      toast.error('Google Client ID is missing!');
      return;
    }
  }, [clientId]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AntApp>
        <MessageProvider>
          <TitleProvider>
            <BreadcrumbProvider>
              <QueryClientProvider client={queryClient}>
                <AppRouter />
              </QueryClientProvider>
            </BreadcrumbProvider>
          </TitleProvider>
        </MessageProvider>
      </AntApp>
    </GoogleOAuthProvider>
  );
}

export default App;
