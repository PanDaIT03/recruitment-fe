import { createSlice } from '@reduxjs/toolkit';
import { getAllFunctionals } from '~/store/thunk/functional';
import { IFunctional } from '~/types/Functional';

export interface IFunctionalState {
  loading?: boolean;
  functionals: IFunctional;
}

const initialState: IFunctionalState = {
  loading: false,
  functionals: {} as IFunctional,
};

const functionalSlice = createSlice({
  name: 'functional',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllFunctionals.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllFunctionals.fulfilled, (state, action) => {
      state.loading = false;
      state.functionals = action.payload;
    });
    builder.addCase(getAllFunctionals.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const functionalReducer = functionalSlice.reducer;
