import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  checkEmailVerification,
  signIn,
  signInWithGoogle,
  signOut,
} from '~/store/thunk/auth';
import { IEmailVerify, IUser } from '~/types/Auth/index';

interface InitType {
  loading: boolean;
  currentUser: IUser;
  accessToken: string | null;
  refreshToken: string | null;
  emailVerification: IEmailVerify | null;
}

const initialState: InitType = {
  loading: false,
  accessToken: null,
  refreshToken: null,
  emailVerification: null,
  currentUser: {} as IUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.currentUser = {} as IUser;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkEmailVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.emailVerification = action.payload;
      })
      .addCase(checkEmailVerification.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;

        state.loading = false;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.currentUser = action.payload;
      })
      .addCase(signIn.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;

        state.loading = false;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.currentUser = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.currentUser = action.payload;

        localStorage.removeItem('persistedState');
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
export const { resetUser, setAccessToken } = authSlice.actions;
