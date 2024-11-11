export enum ROLE {
  USER = 'user',
  ADMIN = 'admin',
  EMPLOYER = 'employer',
}

export interface IRole {
  id: number;
  createBy: string;
  createAt: string;
  updateBy: string;
  updateAt: string;
  title: string;
}
