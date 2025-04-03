// services/api/apiService.js
import axios from 'axios';
import { API_URL } from '../../constants/ApiConstants';

// Create axios instance
class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        const message = 
          error.response?.data?.error?.message || 
          error.response?.data?.message || 
          error.message || 
          'An unexpected error occurred';
        
        return Promise.reject({ message, status: error.response?.status });
      }
    );
    
    this.token = null;
  }

  // Set token for authentication
  setToken(token) {
    this.token = token;
  }
  
  // GET request
  async get(endpoint, params = {}) {
    try {
      return await this.instance.get(endpoint, { params });
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  }
  
  // POST request
  async post(endpoint, data = {}) {
    try {
      return await this.instance.post(endpoint, data);
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  }
  
  // PUT request
  async put(endpoint, data = {}) {
    try {
      return await this.instance.put(endpoint, data);
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  }
  
  // DELETE request
  async delete(endpoint) {
    try {
      return await this.instance.delete(endpoint);
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  }
}

export const api = new ApiService();

export default api;