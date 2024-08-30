export interface IBaseUser {
  userName: string;
  password: string;
}

export interface IUser extends IBaseUser {
  role: string;
}

export interface IAuthContext {
  user?: IUser;
  logout: () => void;
  login: (userData: IUser) => void;
}
