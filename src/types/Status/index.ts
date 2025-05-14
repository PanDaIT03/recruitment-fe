export interface IStatusItem {
  id: number;
  title: string;
  code: string;
  statusType: IStatusType;
}

export interface IStatusType {
  id: number;
  title: string;
  code: string;
}

export interface IGetAllStatusParams {
  type: 'interview' | 'job' | 'schedule' | 'account' | 'candidate_profile';
}

export type IStatus = IPaginatedData<IStatusItem[]>;
