export interface IBaseUser {
  email: string;
  userName?: string;
  password?: string;
}

export interface IEmailVerify {
  message: string;
  hasPassword: boolean;
  signInWith: string;
  statusCode: number;
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
  refreshToken: string;
  message: string;
  statusCode: number;
}

export interface IUserSignIn extends IBaseUser {
  role: string;
}

export interface IUserSignInWithGoogle {
  email: string;
  fullName: string;
  // pic: string;
}

export interface IGoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}
