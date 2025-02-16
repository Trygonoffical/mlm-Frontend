// utils/authUtils.js

export const AUTH_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_INFO: 'user_info'
  };
  
  export const setAuthData = (token, refreshToken, userInfo) => {
    try {
      localStorage.setItem(AUTH_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(AUTH_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };
  
  export const getAuthData = () => {
    try {
      return {
        token: localStorage.getItem(AUTH_KEYS.TOKEN),
        refreshToken: localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN),
        userInfo: JSON.parse(localStorage.getItem(AUTH_KEYS.USER_INFO) || 'null')
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return { token: null, refreshToken: null, userInfo: null };
    }
  };
  
  export const clearAuthData = () => {
    try {
      localStorage.removeItem(AUTH_KEYS.TOKEN);
      localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER_INFO);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };
  
  export const updateToken = (newToken) => {
    try {
      localStorage.setItem(AUTH_KEYS.TOKEN, newToken);
    } catch (error) {
      console.error('Error updating token:', error);
    }
  };