import axiosApi from '~/services/axios';
import {
  IBaseUser,
  IEmailStatus,
  IUser,
  IUserSignInWithGoogle,
  ROLE,
} from '~/types/Auth/index';

type Response = IBaseResponse<{
  data: IUser;
}>;

export interface ISignUpParams extends IBaseUser {
  roleId: ROLE;
}

export interface IVerifyOTP {
  email: string;
  otp: number;
}

export interface IResetPasswordParams {
  email: string;
  password: string;
  token: string;
}

const AuthAPI = {
  // GET
  getMe: async (): Promise<IUser> => {
    return await axiosApi.get('/users/me');
  },
  checkExistedEmail: async (email: string): Promise<IEmailStatus> => {
    return await axiosApi.get(`/users/check-exist-email?email=${email}`);
  },

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

  // PATCH
  changePassword: async () => {
    return await axiosApi.patch('/users/change-password');
  },
  resetPassword: async (
    payload: IResetPasswordParams
  ): Promise<IBaseResponse> => {
    return await axiosApi.patch('/users/reset-password', payload);
  },
};

export default AuthAPI;
