import { useState, useEffect } from 'react';
import { useAppDispatch } from '~/hooks/useStore';

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface UsePaginationProps<T> {
  fetchAction: (page: number) => any;
  pageInfo?: PaginationInfo;
  items?: T[];
}

function usePagination<T>({
  fetchAction,
  pageInfo,
  items,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAction(currentPage));
  }, [currentPage, dispatch, fetchAction]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    pageInfo,
    items,
    handlePageChange,
  };
}

export default usePagination;
