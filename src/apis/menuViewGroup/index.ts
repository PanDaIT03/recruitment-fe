import axiosApi from '~/services/axios';

export interface IGetAllMenuViewGroupParams {
  page?: number;
  pageSize?: number;
  title?: string;
  orderIndex?: number;
  createdDate?: string;
  menuViewIds?: number[];
}

export const MenuViewGroupAPI = {
  getAllMenuViewGroup: async (params: IGetAllMenuViewGroupParams) => {
    return await axiosApi.get('/menu-view-groups/all', {
      params,
    });
  },
};
