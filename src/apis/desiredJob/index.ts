import axiosApi from '~/services/axios';
import { IDesiredJob } from '~/types/DesiredJob';

export interface IGetAllDesiredJob {
  id?: number;
  page?: number;
  pageSize?: number;
  fullName?: string;
  statusId?: number;
  createDate?: string;
  jobFieldId?: number;
  startAfterOffer?: string;
  totalYearExperience?: number;
  type?: 'more' | 'default';
}

export interface IUpdateDesiredJobParams {
  id: number;
  jobFieldsId: number;
  achivements?: string
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
  getAllDesiredJob: async (params: IGetAllDesiredJob) => {
    return await axiosApi.get('/desired-jobs/all', { params });
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
