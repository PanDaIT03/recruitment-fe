export interface IBaseUser {
  email: string;
  userName?: string;
  password?: string;
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
