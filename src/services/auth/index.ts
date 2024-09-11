import axiosApi from '~/services/axios';
import { IBaseUser } from '~/types/Auth';

const apiSignUp = (data: IBaseUser) => console.log(data);
// axiosApi.post('auth/register', data);

export default apiSignUp;
