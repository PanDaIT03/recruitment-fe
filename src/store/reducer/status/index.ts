import { createSlice } from '@reduxjs/toolkit';
import { getAllStatus } from '~/store/thunk/status';
import { IStatus, IStatusItem } from '~/types/Status';

interface IStatusState {
  loading: boolean;
  status: IStatus;
}

const initialState: IStatusState = {
  loading: false,
  status: {
    items: [] as IStatusItem[],
    pageInfo: {} as PageInfo,
  },
};

const statusSlice = createSlice({
  name: 'status',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(getAllStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const statusReducer = statusSlice.reducer;
