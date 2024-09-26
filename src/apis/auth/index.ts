import instance from '~/services/axios';
import { IBaseUser, IUser, IUserSignInWithGoogle } from '~/types/Auth/index';

type Response = IBaseResponse<{
  data: IUser;
}>;

const AuthAPI = {
  signUp: (payload: IBaseUser): Promise<Response> => {
    return instance.post('/auth/register', payload);
  },
  signIn: async (payload: IBaseUser): Promise<IUser> => {
    return await instance.post('/auth/sign-in', payload);
  },
  signInWithGoogle: (payload: IUserSignInWithGoogle): Promise<IUser> => {
    return instance.post('/auth/sign-in', payload).then((response) => response);
  },
};

export default AuthAPI;
