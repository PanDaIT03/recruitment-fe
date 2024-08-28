import axios from 'axios';
// import { store } from "~/store/store";
const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // const at = store.getState()?.user?.account?.access_token;
    // Do something before request is sent
    // config.headers["Authorization"] = "Bearer " + at;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
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
