import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response && response.data ? response.data : response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await instance.post('/auth/refresh-token', {
          refreshToken,
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page or dispatch a logout action
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Retry logic
const retryRequest = async (
  config: InternalAxiosRequestConfig,
  retries = 3,
  delay = 1000
): Promise<AxiosResponse> => {
  try {
    return await instance(config);
  } catch (error) {
    if (retries === 0) {
      return Promise.reject(error);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(config, retries - 1, delay * 2);
  }
};

const axiosApi = {
  get: (url: string, config?: InternalAxiosRequestConfig) =>
    retryRequest({
      ...config,
      method: 'get',
      url,
    } as InternalAxiosRequestConfig),
  post: (url: string, data?: any, config?: InternalAxiosRequestConfig) =>
    retryRequest({
      ...config,
      method: 'post',
      url,
      data,
    } as InternalAxiosRequestConfig),
  put: (url: string, data?: any, config?: InternalAxiosRequestConfig) =>
    retryRequest({
      ...config,
      method: 'put',
      url,
      data,
    } as InternalAxiosRequestConfig),
  delete: (url: string, config?: InternalAxiosRequestConfig) =>
    retryRequest({
      ...config,
      method: 'delete',
      url,
    } as InternalAxiosRequestConfig),
  patch: (url: string, data?: any, config?: InternalAxiosRequestConfig) =>
    retryRequest({
      ...config,
      method: 'patch',
      url,
      data,
    } as InternalAxiosRequestConfig),
};

export default axiosApi;
