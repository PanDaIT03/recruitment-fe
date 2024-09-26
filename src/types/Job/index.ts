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

type NullableNumber = Nullable<number>;

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
  jobsPlacements: JobPlacement[];
  workType: WorkType;
  jobCategory: JobCategory;
}

export interface IJob<T = JobItem> {
  pageInfo: PageInfo;
  items: T[];
}
