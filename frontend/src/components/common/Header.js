import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import React from 'react';


const Header = ({ isAuthenticated, user, logout }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Call the logout function passed from props
    if (logout) logout();
    
    // Redirect to login page
    navigate('/');
    
    // Show success message
    toast.success('Logged out successfully');
  };
  
  return (
    <header className="header">
      <div className="header-container">
        {/* Your existing header code */}
        
        {isAuthenticated && (
          <div className="user-info">
            <span className="user-name">
              {user?.name} ({user?.role === 'student' ? 'Student' : 'Coordinator'})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;