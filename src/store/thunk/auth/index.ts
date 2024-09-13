import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiSignIn } from '~/services/auth';

import { IBaseUser, IUserSignInWithGoogle, User } from '~/types/Auth/index';

enum TYPE_LOGIN {
  TYPE_SYSTEM = 'system',
  TYPE_GOOGLE = 'goole',
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

export const signIn = createAsyncThunk<User | null, IBaseUser>(
  'auth/signIn',
  async (data: IBaseUser, { rejectWithValue }) => {
    try {
      const payload = { ...data, type: TYPE_LOGIN.TYPE_SYSTEM };
      const user = await apiSignIn(payload);
      return user;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);
