export interface IUser {
  userName: string;
  password: string;
}

export interface IAuthContext {
  user?: IUser;
  logout: () => void;
  login: (userData: IUser) => void;
}
