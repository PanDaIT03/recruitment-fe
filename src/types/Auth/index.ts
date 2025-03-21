interface IBaseAuthResponse {
  message: string;
  statusCode: number;
}

interface Placement {
  id: number;
  title: string;
  createBy: string;
  createAt: string;
  updateBy: string;
  updateAt: string;
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

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  companyName: string;
  companyUrl: string;
  isActive: boolean;
  role: Role;
  jobPosition: { id: number; title: string };
  statusCode: number;
  placement: Placement;
  desiredJob: {
    totalYearExperience: number;
  };
}

export interface Role {
  id: number;
  title: string;
}

export interface IUserSignIn extends IBaseUser {
  role: string;
}

export interface IUserSignInWithGoogle {
  email: string;
  fullName: string;
  avatarURL: string;
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
