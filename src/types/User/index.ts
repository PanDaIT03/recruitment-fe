import { IFunctionalItem } from '../Functional';
import { IMyCV } from './profile';

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface Role {
  id: number;
  title: string;
}

interface JobField {
  id: number;
  createBy: number | null;
  createAt: string | null;
  updateBy: number | null;
  updateAt: string | null;
  title: string;
}

interface UserJobField {
  createBy: number | null;
  createAt: string | null;
  updateBy: number | null;
  updateAt: string | null;
  usersId: number;
  jobFieldsId: number;
  jobField: JobField;
}

interface JobPosition {
  id: number;
  title: string;
}

interface UserItem {
  id: number;
  fullName: string;
  phoneNumber: string | null;
  email: string;
  avatarUrl: string | null;
  companyName: string | null;
  companyUrl: string | null;
  isActive: boolean;
  role: Role;
  usersJobFields: UserJobField[];
  jobPosition: JobPosition | null;
}

export interface UserListResponse {
  pageInfo: PageInfo;
  items: UserItem[];
}

export interface IGetCVResponse {
  items: IMyCV[];
  statusCode: number;
}

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
  role: Role;
  hasPassword: boolean;
  jobPosition: { id: number; title: string };
  statusCode: number;
  placement: Placement;
  functionals: string[];
  desiredJob: {
    totalYearExperience: number;
  };
  viewGroups: IViewGroup[];
  standaloneViews: IMenuView[];
}

interface Placement {
  id: number;
  title: string;
  createBy: string;
  createAt: string;
  updateBy: string;
  updateAt: string;
}

export interface IEmailStatus {
  email: string;
  hasPassword: boolean;
  signInWith: string;
  message: string;
  statusCode: number;
}

export interface IViewGroup {
  id: number;
  title: string;
  orderIndex: number;
  menuViews: IMenuView[];
}

export interface IMenuView {
  id: number;
  title: string;
  iconType: string;
  icon: string;
  path: string;
  orderIndex: number;
  menuViewGroupId: number;
  functionals: Pick<IFunctionalItem, 'id' | 'title' | 'code'>[];
}
