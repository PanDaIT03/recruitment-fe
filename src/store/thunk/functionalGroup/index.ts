import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  FunctionalGroupAPI,
  IGetFuncGroupParams,
} from '~/apis/functionalGroup';
import toast from '~/utils/functions/toast';

export const getAllFunctionalGroups = createAsyncThunk(
  'functionalGroup/getAllFunctionalGroups',
  async (params: IGetFuncGroupParams, { rejectWithValue }) => {
    try {
      const response = await FunctionalGroupAPI.getAllFunctionalGroup(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
