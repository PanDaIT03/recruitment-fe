import axiosApi from '~/services/axios';

export interface IGetFuncGroupParams {
  page?: number;
  pageSize?: number;
  title?: string;
  functionalGroupIds?: number[]
}

export interface ICreateFuncGroupParams {
  title: string;
  description: string;
  functionalIds: number[];
}

export interface IUpdateFuncGroupParams {
  id: number;
  title: string;
  description: string;
  functionalIds: number[];
}

export const FunctionalGroupAPI = {
  getAllFunctionalGroup: async (params: IGetFuncGroupParams) => {
    return await axiosApi.get('/functional-groups/all', { params });
  },
  createFunctionalGroup: async (params: ICreateFuncGroupParams) => {
    return await axiosApi.post('/functional-groups', params);
  },
  updateFunctionalGroup: async (params: IUpdateFuncGroupParams) => {
    const { id, ...others } = params;
    return await axiosApi.patch(`/functional-groups/${id}`, others);
  },
  deleteFunctionalGroup: async (id: number) => {
    return await axiosApi.delete(`/functional-groups/${id}`);
  },
};
