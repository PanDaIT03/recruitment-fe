import axiosApi from '~/services/axios';
import {
  IJob,
  JobCategory,
  JobPlacement,
  JobPosition,
  WorkType,
} from '~/types/Job';

export const JobsAPI = {
  getAllJobs: (): Promise<IJob[]> => {
    return axiosApi.get('/jobs/all');
  },
  getJobById: (id: string): Promise<IJob[]> => {
    return axiosApi.get(`/jobs?id=${id}`);
  },
  getAllJobPositions: (): Promise<JobPosition[]> => {
    return axiosApi.get(`job-positions/all`);
  },
  getAllJobCategories: (): Promise<JobCategory[]> => {
    return axiosApi.get(`/job-categories/all`);
  },
  // getAllJobFields: (): Promise<Job[]> => {
  //   return axiosApi.get(`/job-fields/all`);
  // },
  getAllWorkTypes: (): Promise<WorkType[]> => {
    return axiosApi.get(`/work-types/all`);
  },
  getAllPlacements: (): Promise<JobPlacement[]> => {
    return axiosApi.get(`/placements/all`);
  },
};
