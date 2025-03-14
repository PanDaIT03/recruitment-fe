import queryString from 'query-string';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/hooks/useStore';

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface UsePaginationProps<T, P extends { page: number; pageSize: number }> {
  items?: T[];
  pageInfo?: PaginationInfo;
  extraParams?: Partial<Omit<P, 'page' | 'pageSize'>> | undefined;
  fetchAction: (params: P) => any;
}

function usePagination<T, P extends { page: number; pageSize: number }>({
  items,
  pageInfo,
  extraParams,
  fetchAction,
}: UsePaginationProps<T, P>) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isInitialMount = useRef(true);

  const [currentPage, setCurrentPage] = useState(pageInfo?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    pageInfo?.itemsPerPage || 10
  );

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
      page: currentPage,
      pageSize: itemsPerPage,
      ...urlParams.query,
      ...extraParams,
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
        search: queryString.stringify(queryParams),
      },
      { replace: true }
    );
    dispatch(fetchAction(params));
  }, [currentPage, itemsPerPage, extraParams]);

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
    currentPage,
    itemsPerPage,
    handlePageChange,
    hanldeClearURLSearchParams,
  };
}

export default usePagination;
