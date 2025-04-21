export interface IRole {
  id: number;
  title: string;
  description: string;
  rolesFunctionals: IRoleFunctionalItem[];
  createBy: string;
  createAt: string;
  updateBy: string;
  updateAt: string;
  creator: IUser;
  updater: IUser;
}

interface IUser {
  id: number;
  fullName: string;
}

interface IRoleFunctionalItem {
  rolesId: number;
  functionalsId: number;
  role: {
    id: number;
    title: string;
    description: string;
  };
  functional: {
    id: number;
    title: string;
    code: string;
  };
}
