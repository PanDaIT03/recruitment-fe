import { createSlice } from '@reduxjs/toolkit';
import { getAllRoles } from '~/store/thunk/role';
import { IRole } from '~/types/Role';

interface IRoleState {
  loading?: boolean;
  roles: IRole[];
}

const initialState: IRoleState = {
  loading: false,
  roles: [] as IRole[],
};

const roleSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        const { items } = action.payload;

        state.loading = false;
        state.roles = items;
      })
      .addCase(getAllRoles.rejected, (state) => {
        state.loading = false;
        state.roles = [];
      });
  },
});

export const roleReducer = roleSlice.reducer;
