import axiosApi from '~/services/axios';

export interface IGetAllMenuView {
  page?: number;
  pageSize?: number;
  title?: string;
  path?: string;
  type?: string;
  orderIndex?: number;
  iconType?: string;
  createdDate?: string;
}

export interface ICreateMenuView {
  title: string;
  path: string;
  orderIndex: number;
  icon?: string;
  iconType: string;
  functionalIds: number[];
}

export type IUpdateMenuView = Partial<ICreateMenuView> & { id: number };

export const MenuViewAPI = {
  getAllMenuViews: async (params: IGetAllMenuView) => {
    return await axiosApi.get('/menu-view/all', {
      params,
    });
  },
  uploadIcon: async (params: FormData) => {
    return await axiosApi.post('/cloudinary/upload/icon', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  createMenuView: async (params: ICreateMenuView) => {
    return await axiosApi.post('/menu-view', params);
  },
  updateMenuView: async (params: IUpdateMenuView) => {
    const { id, ...rest } = params;
    return await axiosApi.patch(`/menu-view/${id}`, rest);
  },
  deleteMenuView: async (id: number) => {
    return await axiosApi.delete(`/menu-view/${id}`);
  },
};
