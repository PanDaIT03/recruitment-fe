interface CurriculumVitae {
  id: number;
  createBy: number;
  createAt: Date;
  updateBy: null;
  updateAt: null;
  fileName: string;
  url: string;
}

interface Job {
  id: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
  deleteBy: null;
  deleteAt: null;
  description: string;
  quantity: number;
  user: User;
}

interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
}

interface Status {
  id: number;
  createBy: number;
  createAt: Date;
  updateBy: null;
  updateAt: null;
  title: string;
  code: string;
}

export interface IUserAppliedJob {
  createAt: Date;
  cvViewedAt: Date;
  referrerId: null;
  employerUpdateBy: number;
  employerUpdateAt: Date;
  usersId: number;
  jobsId: number;
  job: Job;
  status: Status;
  curriculumVitae: CurriculumVitae;
}

export type IPaginatedUserAppliedJobs = IPaginatedData<IUserAppliedJob[]>;
