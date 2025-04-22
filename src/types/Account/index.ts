import { IUser } from '../User';

export type IFormAccount = Pick<IUser, 'fullName' | 'email'> & {
  newPassword?: string;
  currentPassword?: string;
  reEnterNewPassword?: string;
};
