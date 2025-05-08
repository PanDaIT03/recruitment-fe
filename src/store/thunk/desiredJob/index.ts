import { createAsyncThunk } from '@reduxjs/toolkit';
import { DesiredJobAPI, IGetAllDesiredJob } from '~/apis/desiredJob';
import toast from '~/utils/functions/toast';

export const getAllDesiredJob = createAsyncThunk(
  'desiredJob/getAllDesiredJob',
  async (params: IGetAllDesiredJob, { rejectWithValue }) => {
    try {
      const response = await DesiredJobAPI.getAllDesiredJob(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
