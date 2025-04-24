import axiosApi from '~/services/axios';

export interface IGetAllFunctionalParams {
  page?: number;
  pageSize?: number;
  title?: string;
  code?: string;
  type?: string;
}

export interface ICreateFunctionalParams {
  code: string;
  title: string;
}

export interface IUpdateFunctionalParams extends ICreateFunctionalParams {
  id: number;
}

export const FunctionalAPI = {
  getAllFunctionals: async (params: IGetAllFunctionalParams) => {
    return await axiosApi.get('/functionals/all', { params });
  },
  createFunctional: async (params: ICreateFunctionalParams) => {
    return await axiosApi.post('/functionals', params);
  },
  updateFunctional: async (params: IUpdateFunctionalParams) => {
    const { id, ...others } = params;
    return await axiosApi.patch(`/functionals/${id}`, others);
  },
  deleteFunctional: async (id: number) => {
    return await axiosApi.delete(`/functionals/${id}`);
  },
};
