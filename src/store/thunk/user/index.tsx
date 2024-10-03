import { createAsyncThunk } from '@reduxjs/toolkit';
import UserApi, { IUserProfileParams } from '~/apis/user';
import toast from '~/utils/functions/toast';

export const getUserProfile = createAsyncThunk(
  'userProfile',
  async (data: IUserProfileParams, { rejectWithValue }) => {
    try {
      const response = await UserApi.getUserProfile(data);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
