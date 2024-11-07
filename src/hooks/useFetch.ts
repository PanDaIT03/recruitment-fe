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

  const fetchData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const data = await fetchFunction(params);
      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (mountedRef.current) {
        setState({ data: null, loading: false, error: error as Error });
      }
    }
  }, [fetchFunction, params]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [...dependencies, params]);

  const refetch = useCallback(
    (newParams?: P) => {
      if (newParams !== undefined) {
        setParams(newParams);
      } else {
        fetchData();
      }
    },
    [fetchData, params]
  );

  return { ...state, setParams, refetch };
};
