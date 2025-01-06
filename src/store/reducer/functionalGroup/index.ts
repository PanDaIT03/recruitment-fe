import { createSlice } from '@reduxjs/toolkit';
import { getAllFunctionalGroups } from '~/store/thunk/functionalGroup';
import { IPaginationFunctionalGroup } from '~/types/FunctionalGroup';

export interface IFunctionalGroupState {
  loading?: boolean;
  functionalGroups: IPaginationFunctionalGroup;
}

const initialState: IFunctionalGroupState = {
  loading: false,
  functionalGroups: {} as IPaginationFunctionalGroup,
};

const functionalGroupSlice = createSlice({
  name: 'functionalGroup',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllFunctionalGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllFunctionalGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.functionalGroups = action.payload;
    });
    builder.addCase(getAllFunctionalGroups.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const functionalGroupReducer = functionalGroupSlice.reducer;
