import axiosApi from '~/services/axios';
import { IBaseUser } from '~/types/Auth';

const apiSignUp = async (data: IBaseUser) => {
  // try {
  //   const response = await axiosApi.post('auth/register', data);
  //   return response;
  // } catch (error) {
  //   console.error('Error in apiSignUp:', error);
  //   throw error;
  // }
  console.log(data);
};

export default apiSignUp;
