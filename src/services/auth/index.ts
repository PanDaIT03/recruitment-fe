import instance from '~/services/axios';
import { IBaseUser, User } from '~/types/Auth';

interface MessageRespone {
  message: string;
  statusCode: number;
  data: User;
}

const apiSignUp = (payload: IBaseUser): Promise<MessageRespone> => {
  return instance.post('/auth/register', payload);
};

const apiSignIn = (payload: IBaseUser): Promise<User> => {
  return instance.post('/auth/sign-in', payload).then((response) => response);
};
export { apiSignUp, apiSignIn };
