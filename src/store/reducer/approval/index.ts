import { createSlice } from '@reduxjs/toolkit';
import { getAllCandidateProfile } from '~/store/thunk/approval';
import { IPaginatedApproval } from '~/types/Approval';

interface IApprovalState {
  loading?: boolean;
  approvals: IPaginatedApproval;
}

const initialState: IApprovalState = {
  loading: false,
  approvals: {} as IPaginatedApproval,
};

const approvalSlice = createSlice({
  name: 'approval',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllCandidateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.approvals = action.payload;
      })
      .addCase(getAllCandidateProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const approvalReducer = approvalSlice.reducer;
