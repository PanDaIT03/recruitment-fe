import { PostingJobFormValues } from '~/pages/Employer/PostingJob/PostingJob';
import axiosApi from '~/services/axios';
import {
  IJob,
  JobItem,
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedJobPositions,
  PaginatedWorkTypes,
} from '~/types/Job';

export const JobsAPI = {
  // GET
  getAllJobs: (): Promise<IJob> => {
    return axiosApi.get('/jobs/all');
  },
  getJobById: (id: string): Promise<IJob['items']> => {
    return axiosApi.get(`/jobs?id=${id}`);
  },
  getAllJobPositions: (): Promise<PaginatedJobPositions> => {
    return axiosApi.get(`job-positions/all`);
  },
  getAllJobCategories: (): Promise<PaginatedJobCategories> => {
    return axiosApi.get(`/job-categories/all`);
  },
  getAllWorkTypes: (): Promise<PaginatedWorkTypes> => {
    return axiosApi.get(`/work-types/all`);
  },
  getAllPlacements: (): Promise<JobPlacement[]> => {
    return axiosApi.get(`/placements/all`);
  },
  getAllJobFields: (): Promise<PaginatedJobFields> => {
    return axiosApi.get(`/job-fields/all`);
  },
  // POST
  postJob: (data: PostingJobFormValues): Promise<JobItem> => {
    return axiosApi.post('/jobs', data);
  },
};
