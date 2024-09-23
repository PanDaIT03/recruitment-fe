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

export interface JobPlacement
  extends Omit<BaseEntityWithTitle, 'updateBy' | 'updateAt'> {
  updateBy: string;
  updateAt: number;
  amount?: number;
  detailAddress?: string;
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

type JobField = BaseEntityWithTitle<number, Nullable<number>>;

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
  startPrice: NullableNumber;
  endPrice: NullableNumber;
  startExpYearRequired: NullableNumber;
  endExpYearRequired: NullableNumber;
  applicationDeadline: string;
  workTime: string;
  description: string;
  requirement: string;
  whyLove: string;
  user: IUser;
  jobPosition: JobPosition;
  jobField: Nullable<string>;
  jobsPlacements: JobPlacement[];
  workType: WorkType;
  jobCategory: JobCategory;
}

export interface IJob<T = JobItem> {
  pageInfo: PageInfo;
  items: T[];
}
