import axiosApi from '~/services/axios';
import { IPaginatedApproval } from '~/types/Approval';

export interface IGetAllCandidateProfile {
  page?: number;
  pageSize?: number;
}

export const ApprovalAPI = {
  getAllCandidateProfile: async (
    params: IGetAllCandidateProfile
  ): Promise<IPaginatedApproval> => {
    return await axiosApi.get('/approvals/all', { params });
  },
};
