import { useCallback, useRef, useEffect } from 'react';

type AnyFunction = (...args: any[]) => any;

function useDebounceCallback<T extends AnyFunction>(
  callback: T,
  delay: number,
  deps: any[] = []
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const callbackRef = useRef<T>(callback);

  // Cập nhật callbackRef mỗi khi callback thay đổi
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      // Hủy timeout hiện tại nếu có
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // Gọi phiên bản mới nhất của callback
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...deps]
  ) as T;
}

export default useDebounceCallback;
