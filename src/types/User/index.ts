import { Dayjs } from 'dayjs';

interface IBaseUserProfile {
  companyName: string;
  positionId: number;
  jobCategoriesId: number;
  placementsId: number;
  description: string;
}

export interface IUserProfile {
  statusCode: number;
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
  role: Role;
  jobPosition: string;
  userSkills: any[];
  achivement: string;
  userLanguages: any[];
  workExperiences: any[];
}

export interface Role {
  id: number;
  title: string;
}

export interface IUserProfileData extends IBaseUserProfile {
  startDate: string;
  endDate: string | null;
}

export interface IUserProfileForm extends IBaseUserProfile {
  companyName: string;
  positionId: number;
  jobCategoriesId: number;
  placementsId: number;
  description: string;
  workingTime: Dayjs | Dayjs[];
}
