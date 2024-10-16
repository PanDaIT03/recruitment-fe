import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  checkExistedEmail,
  forgotPassword,
  signIn,
  signInWithGoogle,
  signOut,
  verifyOTP,
} from '~/store/thunk/auth';
import { IEmailStatus, IForgotPassword, IUser } from '~/types/Auth/index';

export interface IAuthState {
  loading?: boolean;
  currentUser: IUser;
  accessToken?: string | null;
  refreshToken?: string | null;
  emailStatus?: IEmailStatus | null;
  forgotPasswordStatus?: IForgotPassword | null;
}

const initialState: IAuthState = {
  loading: false,
  accessToken: null,
  refreshToken: null,
  emailStatus: null,
  forgotPasswordStatus: null,
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
    resetEmailStatus: (state) => {
      state.emailStatus = null;
    },
    resetForgotPasswordStatus: (state) => {
      state.forgotPasswordStatus = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkExistedEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkExistedEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailStatus = action.payload;
      })
      .addCase(checkExistedEmail.rejected, (state) => {
        state.loading = false;
        state.emailStatus = null;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(verifyOTP.rejected, (state) => {
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
        localStorage.removeItem('accessToken');
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordStatus = action.payload;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.loading = false;
        state.forgotPasswordStatus = null;
      });
  },
});

export const authReducer = authSlice.reducer;
export const {
  resetUser,
  resetEmailStatus,
  resetForgotPasswordStatus,
  setAccessToken,
} = authSlice.actions;
