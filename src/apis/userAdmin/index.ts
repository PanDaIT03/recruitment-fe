import axiosApi from '~/services/axios';

export interface IAdminUpdateUser {
  userId: number;
  roleId?: number;
  status?: boolean | string;
}

export interface IGetAllUserAdmin {
  id?: string;
}

export const UserAdminApi = {
  getAllUserAdmin: async (params?: IGetAllUserAdmin) => {
    return await axiosApi.get('/admin/all', { params });
  },
  updateUser: async (params: IAdminUpdateUser) => {
    const { userId, ...rest } = params;
    return await axiosApi.patch(`/admin/update-user/${userId}`, rest);
  },
};
