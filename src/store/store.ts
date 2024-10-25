import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';

import { authReducer } from './reducer/auth';
import { jobReducer } from './reducer/job';
import { userReducer } from './reducer/user';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  user: userReducer,
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
