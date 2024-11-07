import axios from '~/services/axios';
import { IJobField } from '~/types/DesiredJob/DesiredJob';

export type IPaginatedLanguage = IPaginatedData<IJobField[]>;

export const DesiredJobAPI = {
  // GET
  getAllJobFields: async (): Promise<IPaginatedLanguage> => {
    return await axios.get('/job-fields/all');
  },

  // POST
  createApplication: async (data: any) => {
    return await axios.post('/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
