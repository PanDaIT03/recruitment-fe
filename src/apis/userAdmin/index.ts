import axiosApi from '~/services/axios';

export const UserAdminApi = {
  getAllUserAdmin: async () => {
    return await axiosApi.get('/users/all');
  },
};
