import axios from '~/services/axios';
import { IJobField } from '~/types/DesiredJob/DesiredJob';

export type IPaginatedJobField = IPaginatedData<IJobField[]>;

export const DesiredJobAPI = {
  // POST
  createApplication: async (data: any) => {
    return await axios.post('/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
