import axiosApi from '~/services/axios';

export interface IGetFuncGroupParams {
  page?: number;
  pageSize?: number;
}

export interface ICreateFuncGroupParams {
  title: string;
  description: string;
  functionalIds: string[];
}

export const FunctionalGroupAPI = {
  getAllFunctionalGroup: async (params: IGetFuncGroupParams) => {
    return await axiosApi.get('/functional-groups/all', { params });
  },
  createFunctionalGroup: async (params: ICreateFuncGroupParams) => {
    return await axiosApi.post('/functional-groups', params);
  },
};
