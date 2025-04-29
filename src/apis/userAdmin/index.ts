import axiosApi from '~/services/axios';

export interface IAdminUpdateUser {
  userId: number;
  roleId?: number;
  statusId: number;
}

export type IGetAllUserAdmin = Partial<{
  id: number;
  page: number;
  pageSize: number;
  email: string;
  role: number;
  isActive: boolean;
  createdDate: string;
  jobField: number[];
}>;

export const UserAdminApi = {
  getAllUserAdmin: async (params?: IGetAllUserAdmin) => {
    return await axiosApi.get('/admin/users/all', { params });
  },
  updateUser: async (params: IAdminUpdateUser) => {
    const { userId, ...rest } = params;
    return await axiosApi.patch(`/admin/update-user/${userId}`, rest);
  },
};
