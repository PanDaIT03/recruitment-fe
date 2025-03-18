import { IStatusItem } from '../Status';

interface IActorType {
  id: number;
  fullName: string;
}

interface JobPosition {
  id: number;
  title: string;
}

interface Role {
  id: number;
  title: string;
  description: string;
}

interface UsersJobField {
  createBy: null;
  createAt: null;
  updateBy: null;
  updateAt: null;
  usersId: number;
  jobFieldsId: number;
  jobField: JobField;
}

interface JobField {
  id: number;
  createBy: number;
  createAt: Date;
  updateBy: null;
  updateAt: null;
  title: string;
}

export interface IUserAdminItem {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
  status: IStatusItem;
  creator: IActorType;
  updater: IActorType;
  role: Role;
  jobPosition: JobPosition;
  usersJobFields: UsersJobField[];
}

export type IUserAdmin = IPaginatedData<IUserAdminItem[]>;
