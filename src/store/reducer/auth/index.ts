import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IUser, User } from '~/types/Auth/index';

interface InitType {
  currentUser: User | null;
  loading: boolean;
  status: 'loggin successfully' | 'loggin failed' | '';
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: InitType = {
  status: '',
  loading: false,
  currentUser: {} as User,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.status = 'loggin successfully';
        if (action.payload && action.payload.accessToken) {
          state.accessToken = action.payload.accessToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
        }
      })
      .addCase(signIn.rejected, (state) => {
        state.loading = false;
        state.status = 'loggin failed';
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        console.log('reducer', action);
        state.loading = false;
        state.status = 'loggin successfully';
      })
      .addCase(signInWithGoogle.rejected, (state) => {
        state.loading = false;
        state.status = 'loggin failed';
      });
  },
});

export const authReducer = authSlice.reducer;
export const { setAccessToken } = authSlice.actions;
