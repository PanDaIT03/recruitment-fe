import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllJobs, getJobById } from '~/store/thunk/job';
import { IJob, JobItem } from '~/types/Job';

export interface JobState {
  loading: boolean;
  allJobs: IJob | null;
  error: string | null;
  currentJob: JobItem;
}

const initialState: JobState = {
  loading: false,
  allJobs: null,
  currentJob: {} as JobItem,
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action: PayloadAction<IJob>) => {
        state.loading = false;
        state.allJobs = action.payload;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? 'Có lỗi khi lấy danh sách công việc';
      })
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getJobById.fulfilled,
        (state, action: PayloadAction<JobItem>) => {
          state.loading = false;
          state.currentJob = action.payload;
        }
      )
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? 'Có lỗi khi lấy thông tin công việc';
      });
  },
});

export const jobReducer = jobSlice.reducer;
