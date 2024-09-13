import { createAsyncThunk } from '@reduxjs/toolkit';

import AuthAPI from '~/apis/auth';
import { IBaseUser, IUserSignInWithGoogle } from '~/types/Auth/index';

enum TYPE_LOGIN {
  TYPE_SYSTEM = 'system',
  TYPE_GOOGLE = 'google',
}

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (data: any) => {
    const userData: IUserSignInWithGoogle = {
      email: data?.email,
      pic: data?.picture,
      userName: data?.name,
    };

    // const user = await checkLogin({ userName: userData.userName });
    // return user;

    return userData;
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data: IBaseUser, { rejectWithValue }) => {
    try {
      const payload = { ...data, type: TYPE_LOGIN.TYPE_SYSTEM };
      const user = await AuthAPI.signIn(payload);
      
      return user;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);
