import { useState, useEffect, useCallback, useRef } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type FetchFunction<T, P = void> = (params?: P) => Promise<T>;

export const useFetch = <T, P = undefined>(
  fetchFunction: FetchFunction<T, P>, // Allow params to be optional
  initialParams?: P, // Params are optional
  dependencies: any[] = []
) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [params, setParams] = useState<P | undefined>(initialParams);

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (currentParams?: P) => {
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
    (newParams?: P) => {
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
