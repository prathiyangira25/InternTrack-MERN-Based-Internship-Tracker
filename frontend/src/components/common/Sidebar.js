import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();

  // Check if the current path starts with the given path
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>InternTrack</h3>
      </div>
      
      <div className="sidebar-user">
        <p className="user-name">{user?.name}</p>
        <p className="user-role">{user?.role === 'student' ? 'Student' : 'Coordinator'}</p>
      </div>
      
      <div className="sidebar-menu">
        {user?.role === 'student' ? (
          // Student sidebar menu
          <ul>
            <li className={isActive('/student/dashboard') ? 'active' : ''}>
              <Link to="/student/dashboard">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/student/submit') ? 'active' : ''}>
              <Link to="/student/submit">
                <i className="fas fa-plus-circle"></i>
                <span>Submit Internship</span>
              </Link>
            </li>
            <li className={isActive('/student/my-internships') ? 'active' : ''}>
              <Link to="/student/my-internships">
                <i className="fas fa-list"></i>
                <span>My Internships</span>
              </Link>
            </li>
          </ul>
        ) : (
          // Coordinator sidebar menu
          <ul>
            <li className={isActive('/coordinator/dashboard') ? 'active' : ''}>
              <Link to="/coordinator/dashboard">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/coordinator/internships') ? 'active' : ''}>
              <Link to="/coordinator/internships">
                <i className="fas fa-clipboard-list"></i>
                <span>Internships</span>
              </Link>
            </li>
            <li className={isActive('/coordinator/reports') ? 'active' : ''}>
              <Link to="/coordinator/reports">
                <i className="fas fa-chart-bar"></i>
                <span>Reports</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;