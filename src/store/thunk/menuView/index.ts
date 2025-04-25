import { createAsyncThunk } from '@reduxjs/toolkit';
import { IGetAllMenuView, MenuViewAPI } from '~/apis/menuView';
import toast from '~/utils/functions/toast';

export const getAllMenuViews = createAsyncThunk(
  'menuView/getAllMenuViews',
  async (params: IGetAllMenuView, { rejectWithValue }) => {
    try {
      const response = await MenuViewAPI.getAllMenuViews(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
