import axiosApi from '~/services/axios';

export interface IGetFuncGroupParams {
  page?: number;
  pageSize?: number;
}

export const FunctionalGroupAPI = {
  getAllFunctionalGroup: async (params: IGetFuncGroupParams) => {
    return await axiosApi.get('/functional-groups/all', { params });
  },
};
