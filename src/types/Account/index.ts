import { IUser } from '../Auth';

export type IFormAccount = Pick<IUser, 'fullName' | 'email'> & {
  password?: string;
  reEnterPassword?: string;
};
