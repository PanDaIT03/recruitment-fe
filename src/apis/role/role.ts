import axiosApi from '~/services/axios';
import { IRole } from '~/types/Role';

export const RoleApi = {
  getAllRoles: async (): Promise<IPaginatedData<IRole[]>> => {
    return await axiosApi.get('/roles/all');
  },
};
