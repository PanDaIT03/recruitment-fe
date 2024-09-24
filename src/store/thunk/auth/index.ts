import { createAsyncThunk } from '@reduxjs/toolkit';

import AuthAPI from '~/apis/auth';
import { IBaseUser, IUser, IUserSignInWithGoogle } from '~/types/Auth/index';

enum TYPE_LOGIN {
  TYPE_SYSTEM = 'system',
  TYPE_GOOGLE = 'google',
}

export const checkEmailVerification = createAsyncThunk(
  'auth/emailVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      const isExistedEmail = AuthAPI.emailVerification(email);

      return isExistedEmail;
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
