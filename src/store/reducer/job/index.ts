import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllJobs } from '~/store/thunk/job';
import { IJob } from '~/types/Job';

interface InitType {
  loading: boolean;
  allJobs: IJob[];
  error: string | null;
}

const initialState: InitType = {
  loading: false,
  allJobs: [],
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
      .addCase(getAllJobs.fulfilled, (state, action: PayloadAction<IJob[]>) => {
        console.log(action.payload);
        state.loading = false;
        state.allJobs = action.payload;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload || 'Có lỗi';
      });
  },
});

export const jobReducer = jobSlice.reducer;
