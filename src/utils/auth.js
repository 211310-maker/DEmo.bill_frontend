import { APP_BASENAME, TOKEN_KEY, USER_KEY } from '../constants';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
};

export const saveSession = (token, user) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('user@bill');
};

export const redirectToLogin = () => {
  clearSession();
  const base = APP_BASENAME.startsWith('/') ? APP_BASENAME : `/${APP_BASENAME}`;
  window.location.href = `${base}/login`.replace(/\/{2,}/g, '/');
};

export const getAccessStates = (user) => {
  if (!user) return [];
  return user.accessState || user.allowedStates || user.stateAccess || [];
};
