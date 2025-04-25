import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from '~/utils/functions/toast';

import { FunctionalAPI, IGetAllFunctionalParams } from '~/apis/functional';

export const getAllFunctionals = createAsyncThunk(
  'functionals/getAllFunctionals',
  async (params: IGetAllFunctionalParams, { rejectWithValue }) => {
    try {
      const { page, pageSize, title, code, type } = params;
      const formattedParams: IGetAllFunctionalParams = {
        ...(page && { page }),
        ...(pageSize && { pageSize }),
        ...(title && { title: title?.trim() }),
        ...(code && { code: code?.trim() }),
        ...(type && { type: type?.trim() }),
      };

      const response = await FunctionalAPI.getAllFunctionals(formattedParams);
      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
