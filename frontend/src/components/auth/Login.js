import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';
import { validateLoginForm } from '../../services/validation';
import axios from 'axios';

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
/*
  // In your login component
const handleLogin = async () => {
  try {
    const response = await authService.login(credentials);
    if (response.success) {
      localStorage.setItem('token', response.token);
      // other login logic
    }
  } catch (error) {
    console.error(error);
  }
};*/

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const { isValid, errors: validationErrors } = validateLoginForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authService.login(formData);
      
      if (response.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.token);
        console.log('Token saved successfully');
        
        // Call the login function passed from parent component
        login(response.token, response.user);
        
        toast.success('Login successful!', { autoClose: 3000 });
        
        // Redirect based on user role
        if (response.user.role === 'coordinator') {
          navigate('/coordinator/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login to InternTrack</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;