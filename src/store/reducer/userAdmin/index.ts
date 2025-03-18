import { createSlice } from '@reduxjs/toolkit';
import { getAllUserAdmin } from '~/store/thunk/userAdmin';
import { ACCOUNT_STATUS } from '~/types/Status';
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
        const { items, ...rest } = action.payload;
        const data: IUserAdmin = {
          ...rest,
          items: items?.map((item: any) => ({
            ...item,
            isActive: item?.status?.code === ACCOUNT_STATUS.ACTIVE,
          })),
        };

        state.loading = false;
        state.userAdmin = data;
      })
      .addCase(getAllUserAdmin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const userAdminReducer = userAdminSlice.reducer;
