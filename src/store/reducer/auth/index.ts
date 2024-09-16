import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IUser } from '~/types/Auth/index';

interface InitType {
  loading: boolean;
  currentUser: IUser;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: InitType = {
  loading: false,
  accessToken: null,
  refreshToken: null,
  currentUser: {} as IUser,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { accessToken } = action.payload;

        state.loading = false;
        state.accessToken = accessToken;
        state.currentUser = action.payload;
      })
      .addCase(signIn.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        const { accessToken } = action.payload;

        state.loading = false;
        state.accessToken = accessToken;
        state.currentUser = action.payload;

        localStorage.setItem('accessToken', accessToken);
      })
      .addCase(signInWithGoogle.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
export const { setAccessToken } = authSlice.actions;
