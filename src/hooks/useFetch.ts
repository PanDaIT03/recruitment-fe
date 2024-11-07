import { useCallback, useEffect, useRef, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type FetchFunction<T, P> = (params: P) => Promise<T>;

export const useFetch = <T, P>(
  fetchFunction: FetchFunction<T, P>,
  initialParams: P,
  dependencies: any[] = []
) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [params, setParams] = useState<P>(initialParams);

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (currentParams: P) => {
      setState((prev) => ({ ...prev, loading: true }));

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetchFunction(currentParams);
        if (mountedRef.current) {
          setState({ data: response, loading: false, error: null });
        }
      } catch (err) {
        if (mountedRef.current) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error('Có lỗi xảy ra'),
          });
        }
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    fetchData(params);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, params, ...dependencies]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(
    (newParams: P) => {
      if (newParams !== undefined) {
        setParams(newParams);
      } else {
        fetchData(params);
      }
    },
    [fetchData, params]
  );

  return { ...state, refetch, setParams };
};
