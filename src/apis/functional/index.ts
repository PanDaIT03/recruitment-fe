import axiosApi from '~/services/axios';

interface IGetAllFunctionalParams {
  page: number;
  pageSize: number;
}

export const FunctionalAPI = {
  getAllFunctionals: async (params?: IGetAllFunctionalParams) => {
    return axiosApi.get('/functionals/all', { params });
  },
};
