// // utils/cookies.js
// import Cookies from 'js-cookie';

// export const TOKEN_NAME = 'token';
// export const REFRESH_TOKEN_NAME = 'refreshToken';

// export const setTokens = (token, refreshToken) => {
//   // Remove duplicate sameSite property and fix cookie options
//   const commonOptions = {
//     path: '/',
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax'  // Use single sameSite definition
//   };

//   // Set access token
//   Cookies.set(TOKEN_NAME, token, {
//     ...commonOptions,
//     expires: 1 // 1 day
//   });

//   // Set refresh token
//   Cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
//     ...commonOptions,
//     expires: 7 // 7 days
//   });

//   // Verify tokens were set
//   console.log('Tokens after setting:', {
//     token: Cookies.get(TOKEN_NAME),
//     refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
//   });
// };

// export const getTokens = () => {
//   const tokens = {
//     token: Cookies.get(TOKEN_NAME),
//     refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
//   };
//   console.log('Retrieved tokens:', tokens);
//   return tokens;
// };

// export const removeTokens = () => {
//   const options = { path: '/' };  // Need to specify path when removing
//   Cookies.remove(TOKEN_NAME, options);
//   Cookies.remove(REFRESH_TOKEN_NAME, options);
// };

// utils/cookies.js
import Cookies from 'js-cookie';

export const TOKEN_NAME = 'token';
export const REFRESH_TOKEN_NAME = 'refreshToken';

// Common cookie options
const commonOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

export const setTokens = (token, refreshToken) => {
  try {
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
    const verifyTokens = {
      token: Cookies.get(TOKEN_NAME),
      refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
    };
    
    console.log('Tokens set successfully:', verifyTokens);
    return true;
  } catch (error) {
    console.error('Error setting tokens:', error);
    return false;
  }
};

export const getTokens = () => {
  try {
    const tokens = {
      token: Cookies.get(TOKEN_NAME),
      refreshToken: Cookies.get(REFRESH_TOKEN_NAME)
    };
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    return { token: null, refreshToken: null };
  }
};

export const removeTokens = () => {
  try {
    const options = { path: '/' };
    Cookies.remove(TOKEN_NAME, options);
    Cookies.remove(REFRESH_TOKEN_NAME, options);
    console.log('Tokens removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing tokens:', error);
    return false;
  }
};

// Helper to check if tokens exist
export const hasTokens = () => {
  const { token, refreshToken } = getTokens();
  return !!token && !!refreshToken;
};

// Helper to update just the access token
export const updateAccessToken = (newToken) => {
  try {
    Cookies.set(TOKEN_NAME, newToken, {
      ...commonOptions,
      expires: 1
    });
    return true;
  } catch (error) {
    console.error('Error updating access token:', error);
    return false;
  }
};