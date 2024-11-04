import axios from '~/services/axios';

export const DesiredJobAPI = {
  createApplication: async (data: any) => {
    return await axios.post('/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
