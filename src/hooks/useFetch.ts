import { useQuery } from '@tanstack/react-query';

export const useFetch = <T>(queryKey: string[], queryFn: () => Promise<T>) => {
  return useQuery<T>({
    queryKey,
    queryFn,
  });
};
