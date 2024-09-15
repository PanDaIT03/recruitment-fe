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
