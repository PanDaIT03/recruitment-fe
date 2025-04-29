import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from '~/utils/functions/toast';

import { FunctionalAPI, IGetAllFunctionalParams } from '~/apis/functional';

export const getAllFunctionals = createAsyncThunk(
  'functionals/getAllFunctionals',
  async (params: IGetAllFunctionalParams, { rejectWithValue }) => {
    try {
      const response = await FunctionalAPI.getAllFunctionals(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
