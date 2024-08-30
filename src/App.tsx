import { AuthProvider } from './contexts/auth';
import AppRouter from './routes/AppRouter';
import {} from '~/assets/react.svg';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
