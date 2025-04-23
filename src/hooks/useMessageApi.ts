import { useCallback, useState } from 'react';
import { useMessage } from '~/contexts/MessageProvider';

type Parameters<T> = T extends (...args: infer P) => any ? P : never;

interface IProps<T extends (...args: any[]) => Promise<any>> {
  showProcessMessage?: boolean;
  apiFn: T;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
}

const useMessageApi = <T extends (...args: any[]) => Promise<any>>({
  showProcessMessage = true,
  apiFn,
  onSuccess,
  onError,
}: IProps<T>) => {
  const { messageApi } = useMessage();

  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (...args: Parameters<T>) => {
    setIsPending(true);

    try {
      showProcessMessage &&
        messageApi.loading({ key: 'messageApi', content: 'Đang thực hiện...' });

      const response = await apiFn(...args);
      const { message, statusCode } = response;

      if (statusCode === 200) {
        showProcessMessage &&
          messageApi.success({ key: 'messageApi', content: message });

        onSuccess && onSuccess(response);
      }

      setIsPending(false);
    } catch (error: any) {
      showProcessMessage &&
        messageApi.error({
          key: 'messageApi',
          content: `Có lỗi xảy ra: ${error?.response?.data?.message || 'Không xác định'}`,
        });

      setIsPending(false);
      onError && onError(error);
    }
  }, []);

  return { isPending, mutate };
};

export default useMessageApi;
