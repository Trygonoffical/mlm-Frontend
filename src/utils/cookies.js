// utils/cookies.js
import Cookies from 'js-cookie';

export const TOKEN_NAME = 'token';
export const REFRESH_TOKEN_NAME = 'refreshToken';

export const setTokens = (token, refreshToken) => {
  // Remove duplicate sameSite property and fix cookie options
  const commonOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'  // Use single sameSite definition
  };

  // Set access token
  Cookies.set(TOKEN_NAME, token, {
    ...commonOptions,
    expires: 1 // 1 day
  });

  // Set refresh token
  Cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
    ...commonOptions,
    expires: 7 // 7 days
  });

  // Verify tokens were set
  console.log('Tokens after setting:', {
    token: Cookies.get(TOKEN_NAME),
    refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
  });
};

export const getTokens = () => {
  const tokens = {
    token: Cookies.get(TOKEN_NAME),
    refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
  };
  console.log('Retrieved tokens:', tokens);
  return tokens;
};

export const removeTokens = () => {
  const options = { path: '/' };  // Need to specify path when removing
  Cookies.remove(TOKEN_NAME, options);
  Cookies.remove(REFRESH_TOKEN_NAME, options);
};