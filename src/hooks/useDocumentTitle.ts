import { useCallback, useEffect, useState } from 'react';

const useDocumentTitle = () => {
  const [title, setTitle] = useState('Đúng người đúng việc');

  useEffect(() => {
    document.title = title;
  }, [title]);

  const setDocTitle = useCallback((title: string) => {
    setTitle(title);
  }, []);

  return { setDocTitle };
};

export default useDocumentTitle;
