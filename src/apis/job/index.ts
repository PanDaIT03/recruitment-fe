import { AxiosRequestConfig } from 'axios';
import { JobPostingListProps } from '~/pages/Employer/Job/ManageJob';
import { PostingJobFormValues } from '~/pages/Employer/Job/PostingJob';
import { TypeInterview } from '~/pages/Employer/RecruitmentList/ModalInterview';
import { IJobList } from '~/pages/Job/JobList/JobList';
import axiosApi from '~/services/axios';
import {
  Application,
  ApplicationJobDetail,
  IJob,
  JobItem,
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedJobPositions,
  PaginatedWorkTypes,
  Schedule,
  StatusJob,
} from '~/types/Job';

export interface IPaginationParms {
  page?: number;
  pageSize?: number;
}

export interface IParamsUpdateApplicationJob {
  jobsId: number;
  usersId: number;
  statusId: number;
}

export const JobsAPI = {
  // GET
  getAllJobs: (
    data: IPaginationParms & Partial<IJobList> = { page: 1, pageSize: 10 }
  ): Promise<IJob> => {
    const payload: AxiosRequestConfig = {
      params: data,
    };
    return axiosApi.get('/jobs/all', payload);
  },
  getAllJobsForEmployer: (): Promise<JobPostingListProps> => {
    return axiosApi.get(`/jobs/employer/all`);
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
  getAllJobsApplicants: (
    statusId?: number,
    type?: string
  ): Promise<Application> => {
    const payload: AxiosRequestConfig = {
      params: statusId ? { statusId, type } : undefined,
    };
    return axiosApi.get(`/users-jobs/applicants`, payload);
  },
  getApplicantsDetail: (
    userId: number,
    jobId: number
  ): Promise<ApplicationJobDetail> => {
    return axiosApi.get(
      `/users-jobs/applicants/detail?usersId=${userId}&jobsId=${jobId}`
    );
  },
  getSchedulesInterview: (userId: number, jobId: number): Promise<Schedule> => {
    return axiosApi.get(
      `/schedules/interview?usersId=${userId}&jobsId=${jobId}`
    );
  },
  getAllStatusJob: (data?: string): Promise<StatusJob> => {
    const payload: AxiosRequestConfig = {
      params: { type: data },
    };
    return axiosApi.get(`/status/all`, payload);
  },

  // POST
  postJob: (data: PostingJobFormValues): Promise<JobItem> => {
    return axiosApi.post('/jobs', data);
  },
  ApplyJob: (data: FormData): Promise<any> => {
    return axiosApi.post('/users-jobs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  createNewInterview: (data: TypeInterview): Promise<IBaseResponse> => {
    return axiosApi.post(`/schedules`, data);
  },

  // PATCH
  updateJob: (
    id: string,
    data: Partial<any>
  ): Promise<JobItem | IBaseResponse> => {
    return axiosApi.patch(`/jobs/${id}`, data);
  },
  updateInterview: (id: number, data: Partial<any>): Promise<IBaseResponse> => {
    return axiosApi.patch(`/schedules/${id}`, data);
  },
  updateApplicationJob: (
    data: IParamsUpdateApplicationJob
  ): Promise<IBaseResponse> => {
    return axiosApi.patch('/users-jobs', data);
  },

  // DELETE
  deleteJob: (id: number): Promise<IBaseResponse> => {
    return axiosApi.delete(`/jobs/${id}`);
  },
  deleteSchedule: (id: number): Promise<IBaseResponse> => {
    return axiosApi.delete(`/schedules/${id}`);
  },
};
