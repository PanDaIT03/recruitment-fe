import { createSlice } from '@reduxjs/toolkit';

import { login } from '~/store/thunk/auth';
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
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.status = 'loggin successfully';
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.status = 'loggin failed';
      });
  },
});

export const authReducer = authSlice.reducer;
