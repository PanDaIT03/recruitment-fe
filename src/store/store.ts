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

export const store = configureStore({
  preloadedState: loadState(),
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware as Middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
