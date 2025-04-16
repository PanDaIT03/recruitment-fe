import { IUser } from '../User';

export type IFormAccount = Pick<IUser, 'fullName' | 'email'> & {
  password?: string;
  reEnterPassword?: string;
};
