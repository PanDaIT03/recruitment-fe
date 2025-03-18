import { createAsyncThunk } from '@reduxjs/toolkit';

import { StatusAPI } from '~/apis/status';
import { IGetAllStatusParams } from '~/types/Status';
import toast from '~/utils/functions/toast';

export const getAllStatus = createAsyncThunk(
  'status/getAllStatus',
  async (params: IGetAllStatusParams, { rejectWithValue }) => {
    try {
      const response = await StatusAPI.getAllStatus(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
