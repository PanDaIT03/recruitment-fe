import { createAsyncThunk } from '@reduxjs/toolkit';
import { JobsAPI } from '~/apis/job';
import { IJob } from '~/types/Job';

export const getAllJobs = createAsyncThunk<
  IJob[],
  void,
  { rejectValue: string }
>('job/getAllJobs', async (_, { rejectWithValue }) => {
  try {
    const response = await JobsAPI.getAllJobs();

    return response;
  } catch (error) {
    return rejectWithValue('Có lỗi');
  }
});

export const getJobById = createAsyncThunk<
  IJob[],
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
