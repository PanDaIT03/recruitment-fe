import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/hooks/useStore';

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface UsePaginationProps<T, P extends { page: number; pageSize: number }> {
  fetchAction: (params: P) => any;
  pageInfo?: PaginationInfo;
  items?: T[];
  extraParams?: Partial<Omit<P, 'page' | 'pageSize'>> | undefined;
}

function usePagination<T, P extends { page: number; pageSize: number }>({
  fetchAction,
  pageInfo,
  items,
  extraParams,
}: UsePaginationProps<T, P>) {
  const [currentPage, setCurrentPage] = useState(pageInfo?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    pageInfo?.itemsPerPage || 10
  );
  const dispatch = useAppDispatch();
  const isInitialMount = useRef(true);
  const navigate = useNavigate();

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setItemsPerPage(pageSize);
    window.scrollTo(0, 0);
  }, []);

  const fetchData = useCallback(() => {
    const params = {
      page: currentPage,
      pageSize: itemsPerPage,
      ...extraParams,
    } as P;

    navigate(`?page=${currentPage}&pageSize=${itemsPerPage}`);
    dispatch(fetchAction(params));
  }, [dispatch, fetchAction, currentPage, itemsPerPage, extraParams]);

  useEffect(() => {
    console.log(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchData();
    } else {
      const timer = setTimeout(() => {
        fetchData();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [fetchData]);

  return {
    currentPage,
    itemsPerPage,
    pageInfo,
    items,
    handlePageChange,
  };
}

export default usePagination;
