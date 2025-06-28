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
import useQueryParams from './useQueryParams';

type ClientPageInfo = Omit<PageInfo, 'currentPage' | 'itemsPerPage'> & {
  page: number;
  pageSize: number;
};

type PaginationParams = Partial<{
  page: number;
  pageSize: number;
}>;

type PaginationResponse<T> = {
  items: T[];
  pageInfo: ClientPageInfo;
};

interface UsePaginationProps<T, P extends PaginationParams> {
  initialData?: PaginationResponse<T>;
  extraParams?: Partial<Omit<P, 'page' | 'pageSize'>>;
  fetchFn: (params: P) => Promise<T> | any;
  setFilterParams: Dispatch<SetStateAction<any>>;
}

const usePagination = <T, P extends PaginationParams>({
  initialData,
  extraParams,
  fetchFn,
  setFilterParams,
}: UsePaginationProps<T, P>) => {
  const navigate = useNavigate();

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

  const [isPending, setIsPending] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageInfo.page);
  const [itemsPerPage, setItemsPerPage] = useState(pageInfo.pageSize);

  const [data, setData] = useState<PaginationResponse<T>>(
    () =>
      initialData ?? {
        items: [],
        pageInfo: {} as ClientPageInfo,
      }
  );

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setItemsPerPage(pageSize);
    window.scrollTo(0, 0);
  }, []);

  const handleClearURLSearchParams = useCallback((defaultParams?: any) => {
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
    setIsPending(true);

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

        if (value)
          prevVal[key] =
            typeof value === 'string' ? (value as string)?.trim() : value;

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

    fetchFn(queryParams as P)
      .then((res: any) =>
        setData({
          items: res?.payload?.items,
          pageInfo: {
            ...res?.payload?.pageInfo,
            page: res?.payload?.pageInfo?.currentPage,
            pageSize: res?.payload?.pageInfo?.itemsPerPage,
          },
        })
      )
      .finally(() => setIsPending(false));
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
    isPending,
    data: data.items,
    pageInfo: data.pageInfo,
    handlePageChange,
    handleClearURLSearchParams,
  };
};

export default usePagination;
