export interface IUser {
  id: string;
  name: string;
  password: string;
  role: string;
}

export interface IAuthContext {
  user?: IUser;
  logout: () => void;
  login: (userData: IUser) => void;
}
