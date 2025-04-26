import axiosApi from '~/services/axios';

export interface IGetAllRoles {
  page?: number;
  pageSize?: number;
  title?: string;
  createdDate?: string;
  functionalIds?: number[];
}

export interface ICreateRoleParam {
  title: string;
  description: string;
  functionalIds: number[];
}

export interface IUpdateRoleParam extends ICreateRoleParam {
  id: number;
}

export const RoleApi = {
  getAllRoles: async (params: IGetAllRoles) => {
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
