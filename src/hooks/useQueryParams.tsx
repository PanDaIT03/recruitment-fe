import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const { search } = useLocation();

  const searchParams = useMemo(
    () => queryString.parseUrl(search)?.query,
    [search]
  );

  const queryParams = useMemo(() => new URLSearchParams(search), [search]);

  return { searchParams, queryParams };
};

export default useQueryParams;
