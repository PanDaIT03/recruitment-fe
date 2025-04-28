import { createSlice } from '@reduxjs/toolkit';
import { getAllMenuViewGroups } from '~/store/thunk/menuViewGroup';
import { IPaginationMenuViewGroup } from '~/types/MenuViewGroup';

interface IMenuViewGroupState {
  loading?: boolean;
  menuViewGroup: IPaginationMenuViewGroup;
}

const initialState: IMenuViewGroupState = {
  loading: false,
  menuViewGroup: {} as IPaginationMenuViewGroup,
};

const menuViewGroup = createSlice({
  name: 'menuViewGroup',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllMenuViewGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMenuViewGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.menuViewGroup = action.payload;
      })
      .addCase(getAllMenuViewGroups.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const menuViewGroupReducer = menuViewGroup.reducer;
