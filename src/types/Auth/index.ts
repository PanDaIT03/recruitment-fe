interface IBaseAuthResponse {
  message: string;
  statusCode: number;
}

export interface IBaseUser {
  email: string;
  userName?: string;
  password?: string;
}

export interface IEmailStatus extends IBaseAuthResponse {
  email: string;
  hasPassword: boolean;
  signInWith: string;
}

export interface IForgotPassword extends IBaseAuthResponse {
  email?: string;
}

interface IPosition {
  id: number;
  title: string;
}

export interface IUser extends IBaseAuthResponse {
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
