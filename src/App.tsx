import { GoogleOAuthProvider } from '@react-oauth/google';

import { useEffect, useRef } from 'react';
import { MessageProvider } from './contexts/MessageProvider';
import { useAppDispatch } from './hooks/useStore';
import AppRouter from './routes/AppRouter';
import { getMe } from './store/thunk/user';
import toast from './utils/functions/toast';

function App() {
  const dispatch = useAppDispatch();
  const clientId = import.meta.env.VITE_APP_CLIENT_ID;
  let flag = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token1');

    if (!token) return;

    if (!flag.current) {
      dispatch(getMe());
      flag.current = true;
    }
  }, []);

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
