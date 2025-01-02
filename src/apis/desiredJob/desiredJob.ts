import axiosApi from '~/services/axios';
import { IDesiredJob } from '~/types/DesiredJob/DesiredJob';

export interface IUpdateDesiredJobParams {
  id: number;
  jobFieldsId: number;
  startAfterOffer: string;
  salaryExpectation: number;
  jobPositionIds: number[];
  jobPlacementIds: number[];
}

export const DesiredJobAPI = {
  // GET
  getDesiredJob: async (): Promise<IDesiredJob> => {
    return await axiosApi.get('/desired-jobs');
  },

  // POST
  createApplication: async (data: any) => {
    return await axiosApi.post('/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // PATCH
  updateDesiredJob: async (params: IUpdateDesiredJobParams) => {
    const { id, ...others } = params;
    return await axiosApi.patch(`/desired-jobs/${id}`, others);
  },
};
