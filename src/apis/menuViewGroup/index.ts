import axiosApi from '~/services/axios';

export interface IGetAllMenuViewGroupParams {
  page?: number;
  pageSize?: number;
  title?: string;
  orderIndex?: number;
  createdDate?: string;
  menuViewIds?: number[];
}

export interface ICreateMenuViewGroupParams {
  title: string;
  orderIndex: number;
  description: string;
  menuViewIds: number[];
}

export interface IUpdateMenuViewGroupParams {
  id: number;
  title?: string;
  orderIndex?: number;
  description?: string;
  menuViewIds?: number[];
}

export const MenuViewGroupAPI = {
  getAllMenuViewGroup: async (params: IGetAllMenuViewGroupParams) => {
    return await axiosApi.get('/menu-view-groups/all', {
      params,
    });
  },
  createMenuViewGroup: async (params: ICreateMenuViewGroupParams) => {
    return await axiosApi.post('/menu-view-groups', params);
  },
  updateMenuViewGroup: async (params: IUpdateMenuViewGroupParams) => {
    const { id, ...rest } = params;
    return await axiosApi.patch(`/menu-view-groups/${id}`, rest);
  },
  deleteMenuViewGroup: async (id: number) => {
    return await axiosApi.delete(`/menu-view-groups/${id}`);
  },
};
