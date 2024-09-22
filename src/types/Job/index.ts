import { IUser } from '../Auth';

export interface JobPosition {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: number | null;
  updateAt: string | null;
  title: string;
}

export interface JobPlacement {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: string;
  updateAt: number;
  title: string;
}

export interface WorkType {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: number | null;
  updateAt: string | null;
  title: string;
}

export interface JobCategory {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: number | null;
  updateAt: string | null;
  name: string;
  description: string | null;
}

export interface IJob {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: number | null;
  updateAt: string | null;
  title: string;
  startPrice: number | null;
  endPrice: number | null;
  startExpYearRequired: number | null;
  endExpYearRequired: number | null;
  applicationDeadline: string;
  workTime: string;
  description: string;
  requirement: string;
  whyLove: string;
  user: IUser;
  jobPosition: JobPosition;
  jobField: string | null;
  jobsPlacements: JobPlacement[];
  workType: WorkType;
  jobCategory: JobCategory;
}
