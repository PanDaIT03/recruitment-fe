import { createContext, ReactNode, useState } from 'react';
import { IAuthContext, IUser } from '~/types/auth';

export const AuthContext = createContext<IAuthContext>(undefined as never);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>();

  const login = (userData: IUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
