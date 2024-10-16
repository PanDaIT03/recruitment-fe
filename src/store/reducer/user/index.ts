import { createSlice } from '@reduxjs/toolkit';
import { getUserProfile } from '~/store/thunk/user';
import { IUserProfile } from '~/types/User';

export interface IUserProfileState {
  loading?: boolean;
  userProfile: IUserProfile;
}

const initialState: IUserProfileState = {
  loading: false,
  userProfile: {} as IUserProfile,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const userReducer = userSlice.reducer;
