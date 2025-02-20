import axiosApi from '~/services/axios';

export interface IUpdateUserRole {
  userId: number;
  roleId: number;
}

export const UserAdminApi = {
  getAllUserAdmin: async () => {
    return await axiosApi.get('/users/all');
  },
  updateUserRole: async (params: IUpdateUserRole) => {
    return await axiosApi.patch(`/users/update-role/${params.userId}`, {
      roleId: params.roleId,
    });
  },
};
