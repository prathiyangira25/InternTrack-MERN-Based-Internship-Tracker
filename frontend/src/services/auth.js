import { authService } from './api';

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Set auth token and user in localStorage
export const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove auth token and user from localStorage
export const removeAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get authentication token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Logout user
export const logout = () => {
  removeAuth();
  // Can perform additional cleanup here if needed
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if the token has expired
    if (decoded.exp < currentTime) {
      console.error('Token has expired');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Check and refresh authentication if needed
export const checkAuth = async () => {
  const token = getToken();
  
  if (!token || isTokenExpired(token)) {
    removeAuth();
    return false;
  }
  
  try {
    // Verify token with server
    const response = await authService.getCurrentUser();
    if (response.success) {
      setAuth(token, response.user);
      return true;
    } else {
      removeAuth();
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    removeAuth();
    return false;
  }
};

// Check if user has required role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.role === requiredRole;
};