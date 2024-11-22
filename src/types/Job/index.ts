import { IUser } from '../Auth';

type Nullable<T> = T | null;

interface BaseEntity<TId = number, TCreateBy = number> {
  id: TId;
  createBy?: TCreateBy;
  createAt?: string;
  updateBy?: Nullable<number>;
  updateAt?: Nullable<string>;
}

interface Titled {
  title: string;
}

type BaseEntityWithTitle<TId = number, TCreateBy = number> = BaseEntity<
  TId,
  TCreateBy
> &
  Titled;

type JobPosition = BaseEntityWithTitle;

export interface PaginatedJobPositions {
  pageInfo: PageInfo;
  items: JobPosition[];
}

export interface JobPlacement {
  pageInfo: PageInfo;
  items: [
    {
      id: number;
      title: string;
    },
  ];
}

export interface JobPlacementItems {
  jobsId: number;
  placementsId: number;
  placement: {
    id: number;
    title: string;
  };
}

type WorkType = BaseEntityWithTitle;

export interface PaginatedWorkTypes {
  pageInfo: PageInfo;
  items: WorkType[];
}

interface JobCategory extends BaseEntity {
  name: string;
  description: Nullable<string>;
}

export interface PaginatedJobCategories {
  pageInfo: PageInfo;
  items: JobCategory[];
}

type JobField = BaseEntityWithTitle;

export interface PaginatedJobFields {
  pageInfo: PageInfo;
  items: JobField[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface JobItem extends BaseEntityWithTitle {
  statusCode?: number;
  message?: string;
  salaryMax: NullableNumber;
  salaryMin: NullableNumber;
  minExpYearRequired: NullableNumber;
  maxExpYearRequired: NullableNumber;
  applicationDeadline: string;
  workTime: string;
  description: string;
  requirements: string;
  benefits: string;
  whyLove: string;
  user: IUser;
  jobPosition: JobPosition;
  jobField: JobField;
  quantity: number;
  jobsPlacements: JobPlacementItems[];
  workType: WorkType;
  jobCategory: JobCategory;
}

export interface IJob<T = JobItem> {
  pageInfo: PageInfo;
  items: T[];
}

interface Job {
  id: number;
  title: string;
}

interface User {
  id: number;
  fullName: string;
}

export interface Application {
  pageInfo: PageInfo;
  items: {
    createAt: string;
    cvViewedAt: Nullable<string>;
    referrerId: Nullable<number>;
    employerUpdateBy: Nullable<number>;
    employerUpdateAt: Nullable<string>;
    usersId: number;
    jobsId: number;
    job: Job;
    user: User;
    status: Status;
  }[];
}

interface RecruimentJob {
  id: number;
  title: string;
}

interface CurriculumVitae {
  id: number;
  fileName: string;
  url: string;
}

interface Status {
  id: number;
  title: string;
  code: string;
}

export interface Schedule {
  pageInfo: PageInfo;
  items: {
    id: number;
    note: string | null;
    date: string;
    status: Status;
  }[];
}

export interface ApplicationJobDetail {
  statusCode: number;
  createAt: string;
  updateAt: string | null;
  employerUpdateAt: string | null;
  usersId: number;
  jobsId: number;
  job: RecruimentJob;
  applicationStatus: string | null;
  curriculumVitae: CurriculumVitae;
  status: Status;
}

export interface StatusJob {
  pageInfo: PageInfo;
  items: {
    id: number;
    title: string;
    code: string;
    statusType: {
      id: number;
      title: string;
    };
  }[];
}
