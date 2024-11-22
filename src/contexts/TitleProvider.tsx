import React, { useContext, useState } from 'react';

interface TitleContextProps {
  title: string;
  setTitle: React.Dispatch<string>;
}

const TitleContext = React.createContext<TitleContextProps>(undefined as any);
const useTitle = () => useContext(TitleContext);

const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export { useTitle, TitleProvider };
