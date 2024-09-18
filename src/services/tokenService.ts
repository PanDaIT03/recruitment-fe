export const tokenService = {
  getAccessToken: () => {
    const auth = JSON.parse(
      localStorage.getItem('persistedState') || '{}'
    ).auth;
    return auth && auth.currentUser ? auth.currentUser.accessToken : null;
  },
  setAccessToken: (token: string) => {
    const persistedState = JSON.parse(
      localStorage.getItem('persistedState') || '{}'
    );
    if (persistedState.auth && persistedState.auth.currentUser) {
      persistedState.auth.currentUser.accessToken = token;
      localStorage.setItem('persistedState', JSON.stringify(persistedState));
    }
  },
  getRefreshToken: () => {
    const auth = JSON.parse(
      localStorage.getItem('persistedState') || '{}'
    ).auth;
    return auth && auth.currentUser ? auth.currentUser.refreshToken : null;
  },
  setRefreshToken: (token: string) => {
    const persistedState = JSON.parse(
      localStorage.getItem('persistedState') || '{}'
    );
    if (persistedState.auth && persistedState.auth.currentUser) {
      persistedState.auth.currentUser.refreshToken = token;
      localStorage.setItem('persistedState', JSON.stringify(persistedState));
    }
  },
};
