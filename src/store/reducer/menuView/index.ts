import { createSlice } from '@reduxjs/toolkit';
import { getAllMenuViews } from '~/store/thunk/menuView';
import { IPaginationMenuView } from '~/types/MenuVIews';

export interface IMenuViewState {
  loading?: boolean;
  menuViews: IPaginationMenuView;
}

const initialState: IMenuViewState = {
  loading: false,
  menuViews: {} as IPaginationMenuView,
};

const menuViewSlice = createSlice({
  name: 'menuView',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllMenuViews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMenuViews.fulfilled, (state, action) => {
        state.loading = false;
        state.menuViews = action.payload;
      })
      .addCase(getAllMenuViews.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const menuViewsReducer = menuViewSlice.reducer;
