import axiosApi from '~/services/axios';

export interface IGetAllMenuView {
  page?: number;
  pageSize?: number;
  title?: string;
  path?: string;
  orderIndex?: number;
  iconType?: string;
  createdDate?: string;
}

export const MenuViewAPI = {
  getAllMenuViews: async (params: IGetAllMenuView) => {
    return await axiosApi.get('/menu-view/all', {
      params,
    });
  },
};
