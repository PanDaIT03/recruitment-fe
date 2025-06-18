interface DesiredJobsPlacement {
  desiredJobsId: number;
  placementsId: number;
  placement: Placement;
}

interface Placement {
  title: string;
}

interface DesiredJobsPosition {
  desiredJobsId: number;
  jobPositionsId: number;
  jobPosition: Placement;
}

interface JobField {
  id: number;
  title: string;
}

interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  companyName: string;
  companyUrl: string;
  placement: JobField;
  achivement: Achivement;
  userLanguages: UserLanguage[];
  curriculumVitae: CurriculumVitae[];
}

interface Achivement {
  description: string;
}

interface CurriculumVitae {
  id: number;
  fileName: string;
  url: string;
  isDeleted: boolean;
}

interface UserLanguage {
  usersId: number;
  foreignLanguage: ForeignLanguage;
}

interface ForeignLanguage {
  id: number;
  imageUrl: null;
  title: string;
}

interface Approval {
  id: number;
  rejectReason: string;
  status: {
    id: number;
    title: string;
    code: string;
  };
}
export interface IDesiredJob {
  id: number;
  user: Pick<User, 'id' | 'fullName' | 'phoneNumber' | 'email'>;
  createAt: string;
  approveAt: string;
  yearOfBirth: string;
  jobField: JobField;
  startAfterOffer: string;
  salarayExpectation: number;
  totalYearExperience: number;
  desiredJobsPlacement: DesiredJobsPlacement[];
  desiredJobsPosition: DesiredJobsPosition[];
  creator: {
    id: number;
    fullName: string;
  };
  updater: {
    id: number;
    fullName: string;
  };
  approvals: Approval;
}

export type IPaginationDesiredJob = IPaginatedData<IDesiredJob[]>;
