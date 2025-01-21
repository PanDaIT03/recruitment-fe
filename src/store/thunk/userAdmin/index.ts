import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAdminApi } from '~/apis/userAdmin';
import toast from '~/utils/functions/toast';

export const getAllUserAdmin = createAsyncThunk(
  'userAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserAdminApi.getAllUserAdmin();

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
