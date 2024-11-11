import { AxiosRequestConfig } from 'axios';
import { IParams } from '~/components/Job/JobList';
import { PostingJobFormValues } from '~/pages/Employer/PostingJob/PostingJob';
import axiosApi from '~/services/axios';
import {
  Application,
  IJob,
  JobItem,
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedJobPositions,
  PaginatedWorkTypes,
} from '~/types/Job';

export interface IPaginationParms {
  page?: number;
  pageSize?: number;
}

export const JobsAPI = {
  // GET
  getAllJobs: (
    data: IPaginationParms & Partial<IParams> = { page: 1, pageSize: 10 }
  ): Promise<IJob> => {
    const payload: AxiosRequestConfig = {
      params: data,
    };
    return axiosApi.get('/jobs/all', payload);
  },
  getJobById: (id: string): Promise<JobItem> => {
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
  getAllPlacements: (): Promise<JobPlacement> => {
    return axiosApi.get(`/placements/all`);
  },
  getAllJobFields: (): Promise<PaginatedJobFields> => {
    return axiosApi.get(`/job-fields/all`);
  },
  getAllJobsApplicants: (): Promise<Application> => {
    return axiosApi.get(`/users-jobs/applicants`);
  },

  // POST
  postJob: (data: PostingJobFormValues): Promise<JobItem> => {
    return axiosApi.post('/jobs', data);
  },
  ApplyJob: (data: any): Promise<any> => {
    return axiosApi.post('/users-jobs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // PATCH
  updateJob: (id: string, data: Partial<JobItem>): Promise<JobItem> => {
    return axiosApi.patch(`/jobs/${id}`, data);
  },
};
