import axiosApi from '~/services/axios';
import { IBaseUser, IUserSignInWithGoogle } from '~/types/Auth/index';
import { IUser } from '~/types/User';

type Response = IBaseResponse<{
  data: IUser;
}>;

export interface ISignUpParams extends IBaseUser {
  roleId: number;
  jobFieldsIds?: number[];
}

export interface IVerifyOTP {
  email: string;
  otp: number;
}

const AuthAPI = {
  // POST
  signUp: async (payload: ISignUpParams): Promise<Response> => {
    return await axiosApi.post('/auth/register', payload);
  },
  signIn: async (payload: IBaseUser): Promise<IBaseResponse> => {
    return await axiosApi.post('/auth/sign-in', payload);
  },
  signOut: async (): Promise<IBaseResponse> => {
    return await axiosApi.post('/auth/log-out');
  },
  signInWithGoogle: async (
    payload: IUserSignInWithGoogle
  ): Promise<IBaseResponse> => {
    return await axiosApi.post('/auth/sign-in', payload);
  },
  sendOTPToEmail: async (email: string) => {
    return await axiosApi.post('/auth/send-otp', { email });
  },
  verifyOTP: async (payload: IVerifyOTP): Promise<IUser> => {
    return await axiosApi.post('/auth/verify-otp', payload);
  },
  sendResetPasswordUrl: async (email: string): Promise<IBaseResponse> => {
    return await axiosApi.post('/auth/send-reset-password-url', { email });
  },
};

export default AuthAPI;
