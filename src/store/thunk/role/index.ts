import { createAsyncThunk } from '@reduxjs/toolkit';

import { IPaginationParams } from '~/apis/job';
import { RoleApi } from '~/apis/role/role';
import { IRole } from '~/types/Role';
import toast from '~/utils/functions/toast';

export const getAllRoles = createAsyncThunk(
  'role/getAllRoles',
  async (params: IPaginationParams & Partial<IRole>, { rejectWithValue }) => {
    try {
      const response = await RoleApi.getAllRoles(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
