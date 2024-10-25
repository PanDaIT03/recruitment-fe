import { createAsyncThunk } from '@reduxjs/toolkit';

import UserApi, { IUserProfileParams } from '~/apis/user';
import { IUser } from '~/types/Auth';
import toast from '~/utils/functions/toast';

export const getUserProfile = createAsyncThunk(
  'userProfile/getProfile',
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

export const getMe = createAsyncThunk<IUser>('user/getMe', async () => {
  try {
    const response = await UserApi.getMe();
    if (!response) throw new Error('Có lỗi xảy ra');
    return response;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
