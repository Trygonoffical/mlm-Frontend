// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    // setToken: (state, action) => {
    //   state.token = action.payload;
    // },
    setUserLogout: (state, action) => {
      state.userInfo = null;
    },
    // setUserLogin: (state, action) => {
    //   state.token = action.payload.token;
    //   state.userInfo = action.payload;
    //   // console.log('authSlice - ' , action.payload.token);
    // },
    updateUserInfo: (state , action) =>{
      state.userInfo = action.payload;
    },
    
  }
});

export const {
   setUserInfo,
    // setToken, 
    // setUserLogin , 
    updateUserInfo, 
    setUserLogout
  } = authSlice.actions;
export default authSlice.reducer;
