import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllJobs, getJobById } from '~/store/thunk/job';
import { IJob } from '~/types/Job';

interface InitType {
  loading: boolean;
  allJobs: IJob[];
  error: string | null;
  currentJob: IJob[];
}

const initialState: InitType = {
  loading: false,
  allJobs: [],
  currentJob: [],
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllJobs
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action: PayloadAction<IJob[]>) => {
        state.loading = false;
        state.allJobs = action.payload;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Có lỗi';
      })
      // getJobById
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action: PayloadAction<IJob[]>) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Có lỗi khi lấy thông tin công việc';
      });
  },
});

export const jobReducer = jobSlice.reducer;
