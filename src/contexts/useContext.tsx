import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import UserApi from '~/apis/user';
import { IUser } from '~/types/Auth';

interface UserContextType {
  user: IUser | null;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser phải được sử dụng trong UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await UserApi.getMe();
      setUser(response);
    } catch (err) {
      console.log(err instanceof Error ? err : new Error('Có lỗi xảy ra'));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
