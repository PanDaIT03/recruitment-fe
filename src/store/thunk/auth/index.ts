import { createAsyncThunk } from '@reduxjs/toolkit';

import { checkLogin } from '~/api/auth/auth';
import { IBaseUser, IUserSignInWithGoogle } from '~/types/Auth/index';

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

export const signIn = createAsyncThunk('', async (data: IBaseUser) => {
  // const user = await checkLogin(data);
  // if (!user) return null;

  // return user;
  return data;
});
