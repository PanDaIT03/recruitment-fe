import { IStatusType } from '../Status';
import { IUser } from '../User';

export interface IApproval {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: string;
  updateAt: string;
  approveAt: string;
  rejectReason: string;
  status: IStatusType;
  desiredJobSnapshot: IApprovalDesiredJob;
  approver: IApprover;
}

export type IPaginatedApproval = IPaginatedData<IApproval[]>;

interface IApprovalDesiredJob {
  id: number;
  user: User;
  createAt: string;
  createBy: number;
  jobField: JobField;
  updateAt: string;
  updateBy: string;
  yearOfBirth: string;
  startAfterOffer: string;
  salarayExpectation: number;
  totalYearExperience: number;
  desiredJobsPosition: JobPosition[];
  desiredJobsPlacement: JobPlacement[];
}

interface JobField {
  id: number;
  title: string;
  createAt: string;
  createBy: number;
  updateAt: string;
  updateBy: string;
}

interface User extends Omit<IUser, 'viewGroups' | 'standaloneViews'> {
  userSkills: UserSkill[];
  userLanguages: UserLanguage[];
  curriculumVitae: CurriculumVitae[];
  workExperiences: WorkExperience[];
  jobPosition: Pick<JobField, 'id' | 'title'>;
  achivement: {
    id: number;
    description: string;
  };
}

interface UserSkill {
  level: number;
  skill: {
    id: number;
    title: string;
  };
  usersId: number;
  skillsId: number;
}

interface CurriculumVitae {
  id: number;
  url: string;
  fileName: string;
  isDeleted: boolean;
}

interface UserLanguage {
  level: number;
  usersId: number;
  foreignLanguage: ForeignLanguage;
  foreignLanguagesId: number;
}

interface ForeignLanguage {
  id: number;
  title: string;
  imageUrl: string;
}

interface IApprover {
  id: number;
  fullName: string;
}

interface WorkExperience {
  id: number;
  endDate: null;
  isWorking: boolean;
  startDate: string;
  companyName: string;
  description: string;
  jobCategory: {
    id: number;
    name: string;
    description: string;
  };
  placement: { id: string; title: string };
  jobPosition: { id: string; title: string };
}

interface JobPosition {
  desiredJobsId: number;
  jobPositionsId: number;
  jobPosition: {
    id: number;
    title: string;
  };
}

interface JobPlacement {
  desiredJobsId: number;
  placementsId: number;
  placement: {
    id: number;
    title: string;
  };
}
