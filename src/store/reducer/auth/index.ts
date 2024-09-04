import { createSlice } from '@reduxjs/toolkit';

import { signIn, signInWithGoogle } from '~/store/thunk/auth';
import { IUser } from '~/types/Auth/index';

interface InitType {
  currentUser: IUser;
  loading: boolean;
  status: 'loggin successfully' | 'loggin failed' | '';
}

const initialState: InitType = {
  status: '',
  loading: false,
  currentUser: {} as IUser,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.status = 'loggin successfully';
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
