import axiosApi from '~/services/axios';
import { IRole } from '~/types/Role';
import { IPaginationParams } from '../job';

export interface ICreateRoleParam {
  title: string;
  description: string;
  functionalIds: number[];
}

export interface IUpdateRoleParam extends ICreateRoleParam {
  id: number;
}

export const RoleApi = {
  getAllRoles: async (
    params: IPaginationParams & Partial<IRole>
  ): Promise<IPaginatedData<IRole[]>> => {
    return axiosApi.get('/roles/all', { params });
  },
  createRole: async (params: ICreateRoleParam) => {
    return axiosApi.post('/roles', params);
  },
  updateRole: async (params: IUpdateRoleParam) => {
    const { id, ...others } = params;
    return axiosApi.patch(`/roles/${id}`, others);
  },
  deleteRole: async (id: number) => {
    return axiosApi.delete(`/roles/${id}`);
  },
};
