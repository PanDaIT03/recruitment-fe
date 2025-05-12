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

interface Status {
  id: number;
  title: string;
  code: string;
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

// export interface IDesiredJob {
//   statusCode: number;
//   id: number;
//   createAt: Date;
//   salarayExpectation: number;
//   startAfterOffer: string;
//   totalYearExperience: number;
//   yearOfBirth: string;
//   user: User;
//   desiredJobsPlacement: DesiredJobsPlacement[];
//   desiredJobsPosition: DesiredJobsPosition[];
//   jobField: JobField;
// }

//------------

export interface IDesiredJob {
  id: number;
  user: User;
  createAt: string;
  approveAt: string;
  yearOfBirth: string;
  jobField: JobField;
  status: Status;
  rejectReason: string;
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
  approver: {
    id: number;
    fullName: string;
  };
}

//------------

export type IPaginationDesiredJob = IPaginatedData<IDesiredJob[]>;
