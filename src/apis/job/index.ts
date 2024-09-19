import axiosApi from '~/services/axios';
import { IJob } from '~/types/Job';

export const JobsAPI = {
  getAllJobs: (): Promise<IJob[]> => {
    return axiosApi.get('/jobs/all');
  },
  getJobById: (id: string): Promise<IJob[]> => {
    return axiosApi.get(`/jobs?id=${id}`);
  },
};
