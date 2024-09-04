export interface IBaseUser {
  email: string;
  userName?: string;
  password?: string;
}

export interface IUser extends IBaseUser {
  role: string;
}

export interface IUserSignInWithGoogle {
  userName: string;
  email: string;
  pic: string;
}
