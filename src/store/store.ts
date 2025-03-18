import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';

import { authReducer } from './reducer/auth';
import { functionalReducer } from './reducer/functional';
import { functionalGroupReducer } from './reducer/functionalGroup';
import { jobReducer } from './reducer/job';
import { roleReducer } from './reducer/role';
import { statusReducer } from './reducer/status';
import { userAdminReducer } from './reducer/userAdmin';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  role: roleReducer,
  status: statusReducer,
  userAdmin: userAdminReducer,
  functional: functionalReducer,
  functionalGroup: functionalGroupReducer,
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
