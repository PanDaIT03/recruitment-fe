import {
  Action,
  combineReducers,
  configureStore,
  Middleware,
  ThunkAction,
} from '@reduxjs/toolkit';

import {
  loadState,
  localStorageMiddleware,
} from './middlewares/localStorageMiddleware';
import { authReducer } from './reducer/auth';
import { jobReducer } from './reducer/job';
import { userReducer } from './reducer/user';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  user: userReducer,
});

export const store = configureStore({
  preloadedState: loadState(),
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(localStorageMiddleware as Middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
