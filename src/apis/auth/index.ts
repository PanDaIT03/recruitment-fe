import instance from '~/services/axios';
import { IBaseUser, IUser, IUserSignInWithGoogle } from '~/types/Auth/index';

type Response = IBaseResponse<{
  data: IUser;
}>;

const AuthAPI = {
  signUp: (payload: IBaseUser): Promise<Response> => {
    return instance.post('/auth/register', payload);
  },
  signIn: (payload: IBaseUser): Promise<IUser> => {
    return instance.post('/auth/sign-in', payload).then((response) => response);
  },
  signInWithGoogle: (payload: IUserSignInWithGoogle): Promise<IUser> => {
    return instance.post('/auth/sign-in', payload).then((response) => response);
  },
};

export default AuthAPI;
