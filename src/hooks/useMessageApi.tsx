import { useCallback, useState } from 'react';
import { useMessage } from '~/contexts/MessageProvider';

interface IProps {
  apiFn: (params?: any) => Promise<IBaseResponse | any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const useMessageApi = ({ apiFn, onSuccess, onError }: IProps) => {
  const { messageApi } = useMessage();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (params?: any) => {
    setIsPending(true);

    try {
      messageApi.loading({ key: 'messageApi', content: 'Đang thực hiện...' });

      const response = await apiFn(params);
      const { message, statusCode } = response;

      if (statusCode === 200) {
        messageApi.success({ key: 'messageApi', content: message });
        onSuccess && onSuccess(response);
      }

      setIsPending(false);
    } catch (error: any) {
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
