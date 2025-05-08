import { createSlice } from '@reduxjs/toolkit';
import { getAllDesiredJob } from '~/store/thunk/desiredJob';
import { IPaginationDesiredJob } from '~/types/DesiredJob';

interface IDesiredJobState {
  loading?: boolean;
  desiredJob: IPaginationDesiredJob;
}

const initialState: IDesiredJobState = {
  loading: false,
  desiredJob: {} as IPaginationDesiredJob,
};

const desiredJobSlice = createSlice({
  name: 'desiredJob',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllDesiredJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDesiredJob.fulfilled, (state, action) => {
        state.loading = false;
        state.desiredJob = action.payload;
      })
      .addCase(getAllDesiredJob.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const desiredJobReducer = desiredJobSlice.reducer;
