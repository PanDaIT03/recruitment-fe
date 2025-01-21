import { createSlice } from '@reduxjs/toolkit';
import { getAllUserAdmin } from '~/store/thunk/userAdmin';
import { IUserAdmin, IUserAdminItem } from '~/types/User/userAdmin';

interface IUserAdminState {
  loading?: boolean;
  userAdmin: IUserAdmin;
}

const initialState: IUserAdminState = {
  loading: false,
  userAdmin: {
    items: [] as IUserAdminItem[],
    pageInfo: {} as PageInfo,
  },
};

const userAdminSlice = createSlice({
  name: 'userAdmin',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllUserAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.userAdmin = action.payload;
      })
      .addCase(getAllUserAdmin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const userAdminReducer = userAdminSlice.reducer;
