import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IGetAllMenuViewGroupParams,
  MenuViewGroupAPI,
} from '~/apis/menuViewGroup';
import toast from '~/utils/functions/toast';

export const getAllMenuViewGroups = createAsyncThunk(
  'menuViewGroup/getAllMenuViewGroups',
  async (params: IGetAllMenuViewGroupParams, { rejectWithValue }) => {
    try {
      const response = await MenuViewGroupAPI.getAllMenuViewGroup(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
