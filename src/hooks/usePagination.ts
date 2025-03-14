import queryString from 'query-string';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '~/hooks/useStore';
import useQueryParams from './useQueryParams';

interface UsePaginationProps<T, P extends { page: number; pageSize: number }> {
  items?: T[];
  extraParams?: Partial<Omit<P, 'page' | 'pageSize'>> | undefined;
  fetchAction: (params: P) => any;
  setFilterParams: Dispatch<SetStateAction<any>>;
}

function usePagination<T, P extends { page: number; pageSize: number }>({
  items,
  extraParams,
  fetchAction,
  setFilterParams,
}: UsePaginationProps<T, P>) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const { searchParams, queryParams } = useQueryParams();

  const firstRender = useRef(true);
  const isInitialMount = useRef(true);

  const pageInfo = useMemo(
    () => ({
      page: Number(queryParams.get('page') || 1),
      pageSize: Number(queryParams.get('pageSize') || 10),
    }),
    [queryParams]
  );

  const [currentPage, setCurrentPage] = useState(pageInfo.page);
  const [itemsPerPage, setItemsPerPage] = useState(pageInfo.pageSize);

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setItemsPerPage(pageSize);
    window.scrollTo(0, 0);
  }, []);

  const hanldeClearURLSearchParams = useCallback((defaultParams?: any) => {
    const urlParams = { ...defaultParams, page: 1, pageSize: 10 };

    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(urlParams),
      },
      { replace: true }
    );
  }, []);

  const fetchData = useCallback(() => {
    const urlParams = queryString.parseUrl(location.search);
    const params = {
      ...urlParams.query,
      ...extraParams,
      page: currentPage,
      pageSize: itemsPerPage,
    } as P;

    const queryParams = Object.entries(params).reduce(
      (prevVal, currentVal) => {
        const [key, value] = currentVal;
        if (value) prevVal[key] = value;

        return prevVal;
      },
      {} as Record<string, any>
    );

    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(queryParams, {
          sort: (a, b) => {
            if (a === 'page') return -1;
            if (b === 'page') return 1;
            if (a === 'pageSize') return -1;
            if (b === 'pageSize') return 1;

            return 0;
          },
        }),
      },
      { replace: true }
    );
    dispatch(fetchAction(params));
  }, [currentPage, itemsPerPage, extraParams]);

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    setFilterParams({ ...extraParams, ...searchParams });
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      const timer = setTimeout(() => fetchData(), 300);
      return () => clearTimeout(timer);
    }

    isInitialMount.current = false;
  }, [fetchData]);

  return {
    items,
    pageInfo,
    handlePageChange,
    hanldeClearURLSearchParams,
  };
}

export default usePagination;
