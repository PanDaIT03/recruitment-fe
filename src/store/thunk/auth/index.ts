import { createAsyncThunk } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

import { checkLogin } from '~/api/auth/auth';
import { IUser } from '~/types/Auth/index';

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async ({ navigate }: { navigate: NavigateFunction }) => {
    console.log(navigate);
  }
);

export const signIn = createAsyncThunk('', async (data: IUser) => {
  const user = await checkLogin(data);
  if (!user) return null;

  return user;
});
