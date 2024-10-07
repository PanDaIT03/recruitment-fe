import { Dayjs } from 'dayjs';

interface IBaseUserProfile {
  companyName: string;
  positionId: number;
  jobCategoriesId: number;
  placementsId: number;
  description: string;
}

interface JobCategory {
  id: number;
  name: string;
  description: null;
}

interface JobPosition {
  id: number;
  title: string;
}

export interface IWorkExperience {
  id: number;
  companyName: string;
  isWorking: boolean;
  startDate: Date;
  endDate: null;
  description: string;
  placement: JobPosition;
  jobPosition: JobPosition;
  jobCategory: JobCategory;
}

interface Role {
  id: number;
  title: string;
}

//--------------

export interface IUserProfile {
  message?: string;
  statusCode?: number;
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
  userSkills: UserSkill[];
  achivement: Achivement;
  userLanguages: UserLanguage[];
  workExperiences: WorkExperience[];
}

export interface Achivement {
  id: number;
  description: string;
}

export interface UserLanguage {
  level: number;
  usersId: number;
  foreignLanguagesId: number;
  foreignLanguage: Role;
}

export interface UserSkill {
  level: number;
  usersId: number;
  skillsId: number;
  skill: Role;
}

export interface WorkExperience {
  id: number;
  companyName: string;
  isWorking: boolean;
  startDate: Date;
  endDate: null;
  description: string;
  placement: Role;
  jobPosition: Role;
  jobCategory: JobCategory;
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
