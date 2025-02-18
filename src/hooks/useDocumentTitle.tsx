import { useCallback, useEffect, useState } from 'react';

const useDocumentTitle = () => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    document.title = title;
  }, [title]);

  const setDocTitle = useCallback((title: string) => {
    setTitle(title);
  }, []);

  return { setDocTitle };
};

export default useDocumentTitle;
