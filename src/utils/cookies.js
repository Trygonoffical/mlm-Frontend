// utils/cookies.js
import Cookies from 'js-cookie';

export const TOKEN_NAME = 'token';
export const REFRESH_TOKEN_NAME = 'refreshToken';

export const setTokens = (token, refreshToken) => {
  Cookies.set(TOKEN_NAME, token, {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  Cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getTokens = () => {
  return {
    token: Cookies.get(TOKEN_NAME),
    refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
  };
};

export const removeTokens = () => {
  Cookies.remove(TOKEN_NAME);
  Cookies.remove(REFRESH_TOKEN_NAME);
};