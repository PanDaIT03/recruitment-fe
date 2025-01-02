import { AxiosRequestConfig } from 'axios';

import axiosApi from '~/services/axios';
import { IRole } from '~/types/Role';
import { IPaginationParms } from '../job';

export const RoleApi = {
  getAllRoles: async (
    params: IPaginationParms & Partial<IRole>
  ): Promise<IPaginatedData<IRole[]>> => {
    const payload = {
      params: {
        ...(params?.page && { page: params.page }),
        ...(params?.pageSize && { pageSize: params.pageSize }),
        ...(params?.id && { id: params.id }),
      },
    } as AxiosRequestConfig;

    return axiosApi.get('/roles/all', payload);
  },
};
