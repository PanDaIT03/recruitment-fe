import { createAsyncThunk } from '@reduxjs/toolkit';

import { checkLogin } from '~/api/auth/auth';
import { IUser } from '~/types/auth';

export const login = createAsyncThunk('', async (data: IUser) => {
  const user = await checkLogin(data);
  if (!user) return null;

  return user;
});
