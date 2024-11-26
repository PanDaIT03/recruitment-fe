import { createAsyncThunk } from '@reduxjs/toolkit';
import { IPaginationParams, JobsAPI } from '~/apis/job';
import { IJobList } from '~/pages/Job/JobList/JobList';
import { IJob, JobItem } from '~/types/Job';

export const getAllJobs = createAsyncThunk<
  IJob,
  IPaginationParams & IJobList,
  { rejectValue: string }
>('job/getAllJobs', async (params, { rejectWithValue }) => {
  try {
    const {
      type,
      title,
      jobsId,
      statusId,
      salaryMin,
      salaryMax,
      jobFieldsId,
      placementIds,
      workTypesId,
      categoriesId,
    } = params;

    const response = await JobsAPI.getAllJobs({
      ...(type && { type }),
      ...(title && { title }),
      ...(jobsId && { jobsId }),
      ...(statusId && { statusId }),
      ...(salaryMin && { salaryMin }),
      ...(salaryMax && { salaryMax }),
      ...(jobFieldsId && { jobFieldsId }),
      ...(workTypesId && { workTypesId }),
      ...(categoriesId && { categoriesId }),
      ...(placementIds && { placementIds }),
    });
    return response;
  } catch (error) {
    return rejectWithValue('Có lỗi');
  }
});

export const getJobById = createAsyncThunk<
  JobItem,
  string | undefined,
  { rejectValue: string }
>('job/getJobById', async (id, { rejectWithValue }) => {
  try {
    if (!id) {
      return rejectWithValue('ID công việc không hợp lệ');
    }
    const response = await JobsAPI.getJobById(id);
    return response;
  } catch (error) {
    return rejectWithValue('Có lỗi khi lấy thông tin công việc');
  }
});
