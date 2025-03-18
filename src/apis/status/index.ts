import { AxiosRequestConfig } from 'axios';
import axiosApi from '~/services/axios';
import { IGetAllStatusParams, IStatus } from '~/types/Status';

export const StatusAPI = {
  getAllStatus: async (params?: IGetAllStatusParams): Promise<IStatus> => {
    return await axiosApi.get('/status/all', {
      params,
    } as AxiosRequestConfig);
  },
};
