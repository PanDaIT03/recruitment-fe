import { message } from 'antd';
import { createAsyncThunk } from '@reduxjs/toolkit';

import AuthAPI, { IVerifyOTP } from '~/apis/auth';
import { IBaseUser, IUser, IUserSignInWithGoogle } from '~/types/Auth/index';
import toast from '~/utils/functions/toast';

enum TYPE_LOGIN {
  TYPE_SYSTEM = 'system',
  TYPE_GOOGLE = 'google',
}

export const checkExistedEmail = createAsyncThunk(
  'auth/checkExitedEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.checkExistedEmail(email);

      if (response.statusCode === 200)
        await AuthAPI.sendOTPToEmail('daiphucduongvinh203@gmail.com');

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data: IVerifyOTP, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.verifyOTP(data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (data: IUserSignInWithGoogle, { rejectWithValue }) => {
    try {
      const payload = { ...data, type: TYPE_LOGIN.TYPE_GOOGLE };
      const user = await AuthAPI.signInWithGoogle(payload);

      return user;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data: IBaseUser, { rejectWithValue }) => {
    try {
      const payload = { ...data, type: TYPE_LOGIN.TYPE_SYSTEM };
      const user = await AuthAPI.signIn(payload);

      return user;
    } catch (error: any) {
      toast.error(error.response.data.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      return {} as IUser;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
