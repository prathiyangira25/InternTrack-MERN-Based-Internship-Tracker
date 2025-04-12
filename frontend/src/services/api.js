import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Don't set Content-Type for multipart/form-data requests
    // Axios will set the correct boundary automatically
    if (!config.url.includes('upload')) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Always set Authorization if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token included:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// File upload API services
// Modify the fileService object
export const fileService = {
  uploadOfferLetter: async (formData) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Set up request with proper headers
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await api.post('/files/upload/offerLetter', formData, config);
    return response.data;
  },
  
  uploadPermissionLetter: async (formData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    const response = await api.post('/files/upload/permissionLetter', formData, config);
    return response.data;
  },
  
  uploadCompletionCertificate: async (formData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    const response = await api.post('/files/upload/completionCertificate', formData, config);
    return response.data;
  }
};

// Internship API services
export const internshipService = {
  createInternship: async (internshipData) => {
    const response = await api.post('/internships', internshipData);
    return response.data;
  },
  
  getInternships: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/internships${queryString}`);
    return response.data;
  },
  
  getInternship: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },
  
  updateInternship: async (id, internshipData) => {
    const response = await api.put(`/internships/${id}`, internshipData);
    return response.data;
  },
  
  verifyInternship: async (id, comments) => {
    const response = await api.put(`/internships/${id}/verify`, { comments });
    return response.data;
  },
  
  deleteInternship: async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  },
  
  getInternshipStats: async () => {
    const response = await api.get('/internships/stats/dashboard');
    return response.data;
  }
};

export default api;