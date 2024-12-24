import { AxiosRequestConfig } from 'axios';
import axiosApi from '~/services/axios';
import { IGetAllStatusParams, IStatus } from '~/types/Status';

export const StatusAPIs = {
  getAllStatus: async (
    params?: IGetAllStatusParams
  ): Promise<IPaginatedData<IStatus[]>> => {
    return await axiosApi.get('/status/all', {
      params,
    } as AxiosRequestConfig);
  },
};
