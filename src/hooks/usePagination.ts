import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '~/hooks/useStore';

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
interface UsePaginationProps<T> {
  fetchAction: (page: number, pageSize: number) => any;
  pageInfo?: PaginationInfo;
  items?: T[];
}

function usePagination<T>({
  fetchAction,
  pageInfo,
  items,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(pageInfo?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    pageInfo?.itemsPerPage || 10
  );
  const dispatch = useAppDispatch();

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setItemsPerPage(pageSize);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchAction(currentPage, itemsPerPage));
  }, [currentPage, itemsPerPage, dispatch, fetchAction]);

  return {
    currentPage,
    itemsPerPage,
    pageInfo,
    items,
    handlePageChange,
  };
}

export default usePagination;
