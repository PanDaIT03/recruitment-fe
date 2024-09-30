import { createAsyncThunk } from '@reduxjs/toolkit';
import { IPaginationParms, JobsAPI } from '~/apis/job';
import { IParams } from '~/components/Job/JobList';
import { IJob } from '~/types/Job';

export const getAllJobs = createAsyncThunk<
  IJob,
  IPaginationParms & IParams,
  { rejectValue: string }
>('job/getAllJobs', async (params, { rejectWithValue }) => {
  try {
    const response = await JobsAPI.getAllJobs(params);
    return response;
  } catch (error) {
    return rejectWithValue('Có lỗi');
  }
});

export const getJobById = createAsyncThunk<
  IJob['items'],
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
