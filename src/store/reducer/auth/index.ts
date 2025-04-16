import { createSlice } from '@reduxjs/toolkit';
import { checkExistedEmail, getMe, signIn, signOut } from '~/store/thunk/auth';
import { IEmailStatus, IUser } from '~/types/User';

export interface IAuthState {
  loading?: boolean;
  currentUser: IUser;
  emailStatus?: IEmailStatus | null;
}

const initialState: IAuthState = {
  loading: false,
  emailStatus: null,
  currentUser: {} as IUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.currentUser = {} as IUser;
    },
    resetEmailStatus: (state) => {
      state.emailStatus = null;
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
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signIn.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;

        localStorage.removeItem('token1');
        localStorage.removeItem('token2');
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
export const { resetUser, resetEmailStatus } = authSlice.actions;
