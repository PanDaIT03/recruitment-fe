import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApprovalAPI, IGetAllCandidateProfile } from '~/apis/approval';
import toast from '~/utils/functions/toast';

export const getAllCandidateProfile = createAsyncThunk(
  'approval/getAllCandidateProfile',
  async (params: IGetAllCandidateProfile, { rejectWithValue }) => {
    try {
      const response = await ApprovalAPI.getAllCandidateProfile(params);

      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
