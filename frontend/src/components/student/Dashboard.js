import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { internshipService } from '../../services/api';

const Dashboard = ({ user }) => {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0
  });

  useEffect(() => {
    // Fetch student's internships
    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('User is not authenticated. Please log in.');
          return;
        }

        setIsLoading(true);
        const response = await internshipService.getInternships();
        
        if (response.success) {
          setInternships(response.data);
          
          // Calculate stats
          const total = response.data.length;
          const verified = response.data.filter(item => item.verified).length;
          
          setStats({
            total,
            verified,
            pending: total - verified
          });
        }
      } catch (error) {
        console.error('Error fetching internships:', error);
        toast.error('Failed to load internship data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInternships();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Registration Number: {user?.registrationNumber}</p>
        <p>Batch: {user?.batch}</p>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Internships</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        
        <div className="stat-card verified">
          <h3>Verified</h3>
          <p className="stat-number">{stats.verified}</p>
        </div>
        
        <div className="stat-card pending">
          <h3>Pending Verification</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
      </div>
      
      <div className="action-buttons">
        <Link to="/student/submit" className="btn btn-primary">
          Submit New Internship
        </Link>
        
        <Link to="/student/my-internships" className="btn btn-secondary">
          View My Internships
        </Link>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <p>Loading your internship data...</p>
        </div>
      ) : (
        <>
          <h2>Recent Internships</h2>
          
          {internships.length === 0 ? (
            <div className="empty-state">
              <p>You haven't submitted any internships yet.</p>
              <Link to="/student/submit" className="btn btn-outline">
                Submit your first internship
              </Link>
            </div>
          ) : (
            <div className="recent-internships">
              {internships.slice(0, 3).map(internship => (
                <div 
                  key={internship._id} 
                  className={`internship-card ${internship.verified ? 'verified' : 'pending'}`}
                >
                  <div className="internship-header">
                    <h3>{internship.companyName}</h3>
                    <span className={`status ${internship.verified ? 'verified' : 'pending'}`}>
                      {internship.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="internship-details">
                    <p>
                      <span className="label">Duration:</span>
                      <span className="value">{internship.duration} days</span>
                    </p>
                    <p>
                      <span className="label">Stipend:</span>
                      <span className="value">₹{internship.stipend}</span>
                    </p>
                    <p>
                      <span className="label">Type:</span>
                      <span className="value">{internship.internshipType}</span>
                    </p>
                  </div>
                  
                  <div className="internship-dates">
                    <p>
                      <span className="label">From:</span>
                      <span className="value">
                        {new Date(internship.internshipStartDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <span className="label">To:</span>
                      <span className="value">
                        {new Date(internship.internshipEndDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  
                  <Link to={`/student/my-internships?id=${internship._id}`} className="view-link">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {internships.length > 3 && (
            <div className="view-all-link">
              <Link to="/student/my-internships">View all internships</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;