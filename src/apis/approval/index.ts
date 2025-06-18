import { STATUS_CODE } from '~/enums';
import axiosApi from '~/services/axios';

export interface IGetAllCandidateProfile {
  page?: number;
  pageSize?: number;
}

export interface IApprovalProfile {
  id: number;
  code: STATUS_CODE;
  rejectReason?: string;
}

export const ApprovalAPI = {
  getCandidateProfileById: async (id: number) => {
    return await axiosApi.get(`/approvals/${id}`);
  },
  getAllCandidateProfile: async (params: IGetAllCandidateProfile) => {
    return await axiosApi.get('/approvals/all', { params });
  },
  approveProfile: async (params: IApprovalProfile) => {
    const { id, ...others } = params;
    return await axiosApi.patch(`/approvals/approve/${id}`, others);
  },
};
