export interface IBaseUser {
  email: string;
  userName?: string;
  password?: string;
}

interface IPosition {
  id: number;
  title: string;
}

export interface IUser {
  id: string;
  createBy?: string;
  createAt?: string;
  updateBy?: string;
  updateAt?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl?: string;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
  userSkills: any[];
  position: IPosition;
  role: IPosition;
  accessToken: string;
  message: string;
  statusCode: number;
}

export interface IUserSignIn extends IBaseUser {
  role: string;
}

export interface IUserSignInWithGoogle {
  userName: string;
  email: string;
  pic: string;
}
