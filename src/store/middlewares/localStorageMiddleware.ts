import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AuthState } from '../reducer/auth';

export interface PersistedState {
  auth: Pick<AuthState, 'currentUser'>;
}

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState() as RootState;
    const persistedState: PersistedState = {
      auth: {
        currentUser: state.auth.currentUser,
      },
    };
    localStorage.setItem('persistedState', JSON.stringify(persistedState));
    return result;
  };

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('persistedState');
    if (serializedState === null) return undefined;
    const parsedState = JSON.parse(serializedState) as PersistedState;
    return {
      auth: {
        ...parsedState.auth,
        loading: false,
        emailStatus: null,
      },
    };
  } catch (err) {
    return undefined;
  }
};
