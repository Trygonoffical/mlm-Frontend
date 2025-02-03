// homeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configuration for API endpoints and their states
const endpointConfig = {
    sliders: '/home-sliders/',
    advertisements: '/advertisements/',
    categories: '/categories/',
    testimonials: '/testimonials/',
    customPages: '/custom-pages/',
    sections: '/home-sections/',
    successStorie: '/success-story/',
    customerPick: '/customer-pick/',
    menu: '/menu/',
    products: '/products/',
    about: '/about/',
    companyInfo: '/company-info/'
};

// Create a generic fetch function
export const initializeData = createAsyncThunk(
  'home/initializeData',
  async (_, { dispatch }) => {
      // Fetch all data in parallel
      const promises = Object.keys(endpointConfig).map(key => 
          dispatch(fetchData({ endpoint: endpointConfig[key] }))
      );
      await Promise.all(promises);
  }
);

const fetchData = createAsyncThunk(
  'home/fetchData',
  async ({ endpoint, params = {} }, { rejectWithValue }) => {
      try {
          const response = await axios.get(`${API_URL}${endpoint}`, { params });
          return { key: endpoint, data: response.data };
      } catch (error) {
          return rejectWithValue({ key: endpoint, error: error.message });
      }
  }
);

// Create initial state based on configuration
const createInitialState = () => {
    const state = {};
    Object.keys(endpointConfig).forEach(key => {
        state[key] = {
            data: [],
            loading: false,
            error: null
        };
    });
    return state;
};

const homeSlice = createSlice({
    name: 'home',
    initialState: createInitialState(),
    reducers: {
        resetState: (state, action) => {
            const key = action.payload;
            if (key && state[key]) {
                state[key] = createInitialState()[key];
            }
        }
    },
    extraReducers: (builder) => {
        // Generic handlers for all endpoints
        Object.keys(endpointConfig).forEach(key => {
            builder
                .addMatcher(
                    (action) => action.type.startsWith(`home/fetchData/pending`) && action.meta.arg.endpoint === endpointConfig[key],
                    (state, action) => {
                        const endpointKey = Object.keys(endpointConfig).find(k => endpointConfig[k] === action.meta.arg.endpoint);
                        if (endpointKey) {
                            state[endpointKey].loading = true;
                            state[endpointKey].error = null;
                        }
                    }
                )
                .addMatcher(
                    (action) => action.type.startsWith(`home/fetchData/fulfilled`) && action.payload.key === endpointConfig[key],
                    (state, action) => {
                        const endpointKey = Object.keys(endpointConfig).find(k => endpointConfig[k] === action.payload.key);
                        if (endpointKey) {
                            state[endpointKey].loading = false;
                            state[endpointKey].data = action.payload.data;
                            state[endpointKey].error = null;
                        }
                    }
                )
                .addMatcher(
                    (action) => action.type.startsWith(`home/fetchData/rejected`) && action.payload?.key === endpointConfig[key],
                    (state, action) => {
                        const endpointKey = Object.keys(endpointConfig).find(k => endpointConfig[k] === action.payload.key);
                        if (endpointKey) {
                            state[endpointKey].loading = false;
                            state[endpointKey].error = action.payload.error;
                        }
                    }
                );
        });
    }
});

// Export actions and selectors
export const { resetState } = homeSlice.actions;

// Create selectors
export const selectData = (state, key) => state.home[key];

// Create action creator helpers
export const fetchHomeData = (key, params) => {
    return fetchData({ endpoint: endpointConfig[key], params });
};

export default homeSlice.reducer;