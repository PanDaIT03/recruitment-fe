import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  Middleware,
} from '@reduxjs/toolkit';
import { authReducer } from './reducer/auth';
import {
  loadState,
  localStorageMiddleware,
} from './middlewares/localStorageMiddleware';
import { jobReducer } from './reducer/job';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
});

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return defaultMiddleware.concat(localStorageMiddleware as Middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
