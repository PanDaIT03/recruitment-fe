export interface IBaseUser {
  email: string;
  userName?: string;
  password?: string;
}

export interface User {
  id: number;
  createBy: string | null;
  createAt: string;
  updateBy: string | null;
  updateAt: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string | null;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
  userSkills: Array<any>;
  position: {
    id: number;
    title: string;
  };
  role: {
    id: number;
    title: string;
  };
  accessToken: string;
  message: string;
  statusCode: number;
}

export interface IUser extends IBaseUser {
  role: string;
}

export interface IUserSignInWithGoogle {
  userName: string;
  email: string;
  pic: string;
}
