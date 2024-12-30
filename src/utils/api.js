// utils/api.js

// const API_BASE_URL = 'https://api.ardasinterior.com/api';
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/';


// const API_BASE_URL = 'https://api.ardasinterior.com/api';

const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Include credentials like cookies
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};

export default fetchAPI;
