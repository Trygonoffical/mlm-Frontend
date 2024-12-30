import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  // Using axios for API requests (or you can use fetch)

const initialState = {
  homeSlider: [],
  homeAds: [],
  categories: [],
  featureProduct: [],
  homeCatVals: [],
  businessInfo: {},
  topHeadData: {},
  popupData: {},
  tabProducts: {},
  mainMenu: [],
  aboutPage: {},
  loading: false,        // To handle loading states
  error: null,           // To handle errors
};

// Thunks for async API calls
// export const fetchRemoteConfig = createAsyncThunk('home/remoteConfig', async () => {
//   const response = await axios.get('http://127.0.0.1:8000/api/v1/config/');  // Replace with your API URL
//   console.log('remoteconfigdata - ', response.data)
//   return response.data;
// });

// Slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // Synchronous actions here if needed
    // updateTopHeadReducers: (state, action) => {
    //   state.topHeadData = action.payload
    // }
  },
  // extraReducers: (builder) => {
  //   // Handle async actions
  //   builder
  //     .addCase(fetchRemoteConfig.pending, (state) => {
  //       state.loading = true;
  //     })
  //     .addCase(fetchRemoteConfig.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.homeSlider = action.payload.Homesliders;
  //       state.homeAds = action.payload.adbans;
  //       state.categories = action.payload.categories;
  //       state.featureProduct = action.payload.featureProducts;
  //       state.homeCatVals = action.payload.categories.filter(option => action.payload.homecatsval.includes(option.id))
  //       // state.homeCatVals = action.payload.homeCatVals;
  //       state.businessInfo = action.payload.companyData;
  //       state.topHeadData = action.payload.topHeadData;
  //       state.popupData = action.payload.popUpData;
  //       state.tabProducts = action.payload.HomeTabs;
  //       state.mainMenu = action.payload.homeMenu;
  //       state.aboutPage = action.payload.about;

  //       console.log('remote fetch data -', action.payload)
  //     })
  //     .addCase(fetchRemoteConfig.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message;
  //     })
  // },
});

// export const { updateTopHeadReducers } = homeSlice.actions;
export default homeSlice.reducer;
