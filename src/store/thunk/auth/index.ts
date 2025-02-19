import { createAsyncThunk } from '@reduxjs/toolkit';

import AuthAPI from '~/apis/auth';
import { IBaseUser, IUser, IUserSignInWithGoogle } from '~/types/Auth/index';
import toast from '~/utils/functions/toast';
import { getAllRoles } from '../role';

enum TYPE_LOGIN {
  TYPE_SYSTEM = 'system',
  TYPE_GOOGLE = 'google',
}

export const checkExistedEmail = createAsyncThunk(
  'auth/checkExitedEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.checkExistedEmail(email);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (data: IUserSignInWithGoogle, { rejectWithValue, dispatch }) => {
    try {
      const payload = { ...data, type: TYPE_LOGIN.TYPE_GOOGLE };
      const { statusCode } = await AuthAPI.signInWithGoogle(payload);

      if (statusCode === 200) {
        dispatch(getMe());
        dispatch(getAllRoles({}));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data: IBaseUser, { rejectWithValue, dispatch }) => {
    try {
      const payload = { ...data, type: TYPE_LOGIN.TYPE_SYSTEM };
      const { statusCode } = await AuthAPI.signIn(payload);

      if (statusCode === 200) {
        dispatch(getMe());
        dispatch(getAllRoles({}));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const getMe = createAsyncThunk<IUser>('auth/getMe', async () => {
  try {
    const response = await AuthAPI.getMe();
    if (!response) throw new Error('Có lỗi xảy ra');

    return response;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await AuthAPI.signOut();

      return {} as IUser;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
