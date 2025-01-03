export interface IStatus {
  id: number;
  title: string;
  code: string;
  statusType: IStatusType;
}

export interface IStatusType {
  id: number;
  title: string;
}

export interface IGetAllStatusParams {
  type: 'interview' | 'job' | 'schedule';
}
