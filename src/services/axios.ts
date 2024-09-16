import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { setAccessToken } from '~/store/reducer/auth';

// import { setAccessToken, logout } from '~/store/reducer/auth';
import { store } from '~/store/store';
import toast from '~/utils/functions/toast';
import PATH from '~/utils/path';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken && config.headers)
      config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = store.getState().auth.refreshToken;
        const response = await instance.post<{ accessToken: string }>(
          '/auth/sign-in',
          {
            refreshToken,
          }
        );
        const { accessToken } = response.data;
        console.log(accessToken);
        store.dispatch(setAccessToken(accessToken));

        if (originalRequest.headers)
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        window.location.href = PATH.SIGN_IN;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const retryRequest = async <T>(
  config: InternalAxiosRequestConfig,
  retries = 3,
  delay = 3000
): Promise<T> => {
  try {
    const response = await instance(config);
    return response as T;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      !error.response &&
      error.code === 'ECONNABORTED'
    ) {
      if (retries === 1) {
        toast.warning('Hết thời gian truy cập. Xin vui lòng thử lại.');
        return Promise.reject(error);
      }

      if (retries === 0) return Promise.reject(error);

      await new Promise((resolve) => setTimeout(resolve, delay));

      return retryRequest<T>(config, retries - 1, delay * 2);
    }

    return Promise.reject(error);
  }
};

const axiosApi = {
  get: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
    retryRequest<T>({
      ...config,
      method: 'get',
      url,
    } as InternalAxiosRequestConfig),
  post: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'post',
      url,
      data,
    } as InternalAxiosRequestConfig),
  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'put',
      url,
      data,
    } as InternalAxiosRequestConfig),
  delete: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
    retryRequest<T>({
      ...config,
      method: 'delete',
      url,
    } as InternalAxiosRequestConfig),
  patch: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'patch',
      url,
      data,
    } as InternalAxiosRequestConfig),
};

export default axiosApi;
