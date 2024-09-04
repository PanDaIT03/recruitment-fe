import { createAsyncThunk } from '@reduxjs/toolkit';

import { IUser } from '~/types/Auth/index';
import { checkLogin } from '~/api/auth/auth';

export const login = createAsyncThunk('', async (data: IUser) => {
  const user = await checkLogin(data);
  if (!user) return null;

  return user;
});
