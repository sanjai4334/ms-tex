import axios from 'axios';
import { store } from '../store'; // Import your Redux store

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9999',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // For cookies if using HTTP-only tokens
  timeout: 10000 // 10 second timeout
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(config => {
  // Add auth token if exists
  const token = store.getState().auth.token || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log('[AXIOS] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
  }
  
  return config;
}, error => {
  if (import.meta.env.DEV) {
    console.error('[AXIOS] Request Error:', error);
  }
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log('[AXIOS] Response:', {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        store.dispatch({ type: 'auth/logout' });
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        api.post('/auth/refresh-token', { token: refreshToken })
          .then(({ data }) => {
            store.dispatch({ type: 'auth/login/fulfilled', payload: { token: data.token } });
            localStorage.setItem('token', data.token);
            originalRequest.headers.Authorization = 'Bearer ' + data.token;
            processQueue(null, data.token);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            store.dispatch({ type: 'auth/logout' });
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    if (import.meta.env.DEV) {
      console.error('[AXIOS] Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
        message: error.message
      });
    }

    // Standardize error response
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
  }
);

export default api;
