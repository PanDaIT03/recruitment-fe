import axiosApi from '~/services/axios';
import {
  IBaseUser,
  IEmailStatus,
  IUser,
  IUserSignInWithGoogle,
} from '~/types/Auth/index';

type Response = IBaseResponse<{
  data: IUser;
}>;

export interface IVerifyOTP {
  email: string;
  otp: number;
}

const AuthAPI = {
  signUp: async (payload: IBaseUser): Promise<Response> => {
    return await axiosApi.post('/auth/register', payload);
  },
  signIn: async (payload: IBaseUser): Promise<IUser> => {
    return await axiosApi.post('/auth/sign-in', payload);
  },
  signInWithGoogle: async (payload: IUserSignInWithGoogle): Promise<IUser> => {
    return await axiosApi.post('/auth/sign-in', payload);
  },
  checkExistedEmail: async (email: string): Promise<IEmailStatus> => {
    return await axiosApi.get(`/users/check-exist-email?email=${email}`);
  },
  sendOTPToEmail: async (email: string) => {
    return await axiosApi.post('/auth/send-otp', { email });
  },
  verifyOTP: async (payload: IVerifyOTP): Promise<IUser> => {
    return await axiosApi.post('/auth/verify-otp', payload);
  },
  changePassword: async () => {
    return await axiosApi.patch('/users/change-password')
  }
};

export default AuthAPI;
