import { notification } from 'antd';

type TypeNotification = 'success' | 'info' | 'warning' | 'error';

interface ToastOptions {
  message?: string;
  description?: string;
}

const defaultMessages: Record<TypeNotification, string> = {
  success: 'Thành công',
  info: 'Thông tin',
  warning: 'Cảnh báo',
  error: 'Có lỗi xảy ra',
};

const generateNotificationKey = () => `notification_${Date.now()}`;

const showNotification = (
  type: TypeNotification,
  { message, description }: ToastOptions = {}
): void => {
  const key = generateNotificationKey();

  notification[type]({
    key,
    message: message || defaultMessages[type],
    description,
    placement: 'topRight',
    onClick: () => notification.destroy(key),
    duration: 3,
    className: 'cursor-pointer',
  });
};

const toast = {
  success: (description: string) =>
    showNotification('success', { description }),
  info: (description: string) => showNotification('info', { description }),
  warning: (description: string) =>
    showNotification('warning', { description }),
  error: (description: string) => showNotification('error', { description }),
};

export default toast;
