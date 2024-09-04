import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// import { store } from "~/store/store";
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

instance.defaults.headers.common['Content-Type'] = 'application/json';
// Add a request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // const accessToken = store.getState()?.user?.account?.access_token;

    // if (accessToen && config.headers) {
    //   config.headers.Authorization = `Bearer ${accessToken}`
    // }

    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },

  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.response);
    return error && error.response && error.response.data
      ? error.response.data
      : Promise.reject(error);
  }
);

export default instance;
