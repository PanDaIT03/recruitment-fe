import { createAsyncThunk } from '@reduxjs/toolkit';
import { FunctionalAPI } from '~/apis/functional';
import toast from '~/utils/functions/toast';

export const getAllFunctionals = createAsyncThunk(
  'functionals/getAllFunctionals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await FunctionalAPI.getAllFunctionals();

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
