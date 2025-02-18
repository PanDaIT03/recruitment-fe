import { createSlice } from '@reduxjs/toolkit';
import { getAllRoles } from '~/store/thunk/role';
import { PageInfo } from '~/types/Job';
import { IRole } from '~/types/Role';

interface IRoleState {
  loading?: boolean;
  roles: {
    items: IRole[];
    pageInfo: PageInfo;
  };
}

const initialState: IRoleState = {
  loading: false,
  roles: {
    items: [] as IRole[],
    pageInfo: {} as PageInfo,
  },
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
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const roleReducer = roleSlice.reducer;
