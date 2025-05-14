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
  startAfterOffer: string;
  salaryExpectation: number;
  jobPositionIds: number[];
  jobPlacementIds: number[];
}

export interface IApproveProfileParams {
  id: number;
  rejectReason?: string;
  type: 'approve' | 'reject';
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
  approveProfile: async (params: IApproveProfileParams) => {
    const { id, ...rest } = params;
    return await axiosApi.patch(`/desired-jobs/approve/${id}`, rest);
  },
};
