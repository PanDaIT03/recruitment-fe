import instance from '~/services/axios';
import { IBaseUser } from '~/types/Auth';

interface MessageRespone {
  message: string;
  statusCode: number;
  data: any;
}

const apiSignUp = (payload: IBaseUser): Promise<MessageRespone> => {
  return instance.post('/auth/register', payload);
};

const apiSignIn = (payload: IBaseUser): Promise<MessageRespone> => {
  return instance.post('/auth/sign-in', payload);
};

export { apiSignUp, apiSignIn };
