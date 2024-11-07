import { useCallback, useState } from 'react';
import { useMessage } from '~/contexts/MessageProvider';

interface IProps<T> {
  showProcessMessage?: boolean;
  apiFn: (params: T) => Promise<IBaseResponse | any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const useMessageApi = <T,>({
  showProcessMessage = true,
  apiFn,
  onSuccess,
  onError,
}: IProps<T>) => {
  const { messageApi } = useMessage();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (params: T) => {
    setIsPending(true);

    try {
      showProcessMessage &&
        messageApi.loading({ key: 'messageApi', content: 'Đang thực hiện...' });

      const response = await apiFn(params);
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
