import { createAsyncThunk } from '@reduxjs/toolkit';
import { RoleApi } from '~/apis/role/role';
import toast from '~/utils/functions/toast';

export const getAllRoles = createAsyncThunk(
  'role/getAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await RoleApi.getAllRoles();

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
