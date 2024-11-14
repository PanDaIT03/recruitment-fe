import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';

import { authReducer } from './reducer/auth';
import { jobReducer } from './reducer/job';
import { roleReducer } from './reducer/role';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  role: roleReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
