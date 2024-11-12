import { Dayjs } from 'dayjs';

interface IBaseUserProfile {
  companyName: string;
  positionId: number;
  jobCategoriesId: number;
  placementsId: number;
  description: string;
}

interface Role {
  id: number;
  title: string;
}

interface JobCategory {
  id: number;
  name: string;
  description: null;
}

interface ForeignLanguage {
  id: number;
  imageUrl: null;
  title: string;
}

interface Skill {
  id: number;
  title: string;
}

interface JobPosition {
  id: number;
  title: string;
}

//----------------

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
  userSkills: IUserSkill[];
  achievement: IAchievement;
  userLanguages: IForeignLanguage[];
  workExperiences: IWorkExperience[];
}

export interface IUserProfileData extends IBaseUserProfile {
  startDate: string;
  endDate: string | null;
}

export interface IUserProfileForm extends IBaseUserProfile {
  workingTime: Dayjs | Dayjs[];
}

export interface ILanguageComboBox {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: string;
  updateAt: string;
  title: string;
}

export interface ISkillComboBox {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: string;
  updateAt: string;
  title: string;
}

export interface IAchievement {
  id: number;
  description: string;
}

export interface IForeignLanguage {
  level: number;
  usersId: number;
  foreignLanguagesId: number;
  foreignLanguage: ForeignLanguage;
}

export interface IUserSkill {
  level: number;
  usersId: number;
  skillsId: number;
  skill: Skill;
}

export interface IWorkExperience {
  id: number;
  companyName: string;
  isWorking: boolean;
  startDate: Date;
  endDate: null;
  description: string;
  jobCategory: JobCategory;
  jobPosition: JobPosition;
  placement: JobPosition;
}
