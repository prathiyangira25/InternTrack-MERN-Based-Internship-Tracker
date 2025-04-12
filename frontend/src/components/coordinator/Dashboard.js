import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { internshipService } from '../../services/api';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalInternships: 0,
    byType: { academic: 0, industry: 0 },
    bySource: { cdc: 0, nonCdc: 0 },
    byLocation: { india: 0, abroad: 0 },
    byVerification: { verified: 0, unverified: 0 },
    byBatch: [],
    byCompany: [],
    stipendStats: { avgStipend: 0, maxStipend: 0 }
  });
  
  const [recentInternships, setRecentInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Attempting to fetch dashboard data...');
        setIsLoading(true);
        
        console.log('Using token:', localStorage.getItem('token') ? 'Token exists' : 'No token');

        const statsResponse = await internshipService.getInternshipStats()
        .catch(error => {
          console.error('Stats fetch error details:', error.response?.data || error.message);
          throw error;
        });
      
      console.log('Stats response:', statsResponse);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        // Fetch recent internships (latest 5)
        const internshipsResponse = await internshipService.getInternships({
          limit: 5,
          sort: '-createdAt'
        });
        
        if (internshipsResponse.success) {
          setRecentInternships(internshipsResponse.data);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Failed to load dashboard: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Coordinator Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="stats-overview">
            <div className="stats-row">
              <div className="stat-card">
                <h3>Total Internships</h3>
                <p className="stat-number">{stats.totalInternships}</p>
              </div>
              
              <div className="stat-card verified">
                <h3>Verified</h3>
                <p className="stat-number">{stats.byVerification.verified}</p>
              </div>
              
              <div className="stat-card pending">
                <h3>Pending Verification</h3>
                <p className="stat-number">{stats.byVerification.unverified}</p>
              </div>
            </div>
            
            <div className="stats-row">
              <div className="stat-card">
                <h3>Academic</h3>
                <p className="stat-number">{stats.byType.academic}</p>
              </div>
              
              <div className="stat-card">
                <h3>Industry</h3>
                <p className="stat-number">{stats.byType.industry}</p>
              </div>
              
              <div className="stat-card">
                <h3>CDC</h3>
                <p className="stat-number">{stats.bySource.cdc}</p>
              </div>
              
              <div className="stat-card">
                <h3>Non-CDC</h3>
                <p className="stat-number">{stats.bySource.nonCdc}</p>
              </div>
            </div>
            
            <div className="stats-row">
              <div className="stat-card">
                <h3>In India</h3>
                <p className="stat-number">{stats.byLocation.india}</p>
              </div>
              
              <div className="stat-card">
                <h3>Abroad</h3>
                <p className="stat-number">{stats.byLocation.abroad}</p>
              </div>
              
              <div className="stat-card">
                <h3>Avg. Stipend</h3>
                <p className="stat-number">₹{stats.stipendStats.avgStipend.toFixed(2)}</p>
              </div>
              
              <div className="stat-card">
                <h3>Max Stipend</h3>
                <p className="stat-number">₹{stats.stipendStats.maxStipend}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-sections">
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Internships by Batch</h2>
                <Link to="/coordinator/reports" className="view-all-link">View All</Link>
              </div>
              
              <div className="batch-stats">
                {stats.byBatch.map(batch => (
                  <div key={batch._id} className="batch-stat-item">
                    <div className="batch-label">{batch._id}</div>
                    <div className="batch-value">{batch.count}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Top Companies</h2>
                <Link to="/coordinator/reports" className="view-all-link">View All</Link>
              </div>
              
              <div className="company-stats">
                {stats.byCompany.slice(0, 5).map(company => (
                  <div key={company._id} className="company-stat-item">
                    <div className="company-label">{company._id}</div>
                    <div className="company-value">{company.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Internships</h2>
              <Link to="/coordinator/internships" className="view-all-link">View All</Link>
            </div>
            
            {recentInternships.length === 0 ? (
              <div className="empty-state">
                <p>No internships submitted yet.</p>
              </div>
            ) : (
              <div className="recent-internships-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Registration No.</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Stipend</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInternships.map(internship => (
                      <tr key={internship._id}>
                        <td>{internship.student?.name || 'N/A'}</td>
                        <td>{internship.registrationNumber}</td>
                        <td>{internship.companyName}</td>
                        <td>{internship.internshipType}</td>
                        <td>₹{internship.stipend}</td>
                        <td>{formatDate(internship.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${internship.verified ? 'verified' : 'pending'}`}>
                            {internship.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <Link 
                            to={`/coordinator/verify/${internship._id}`}
                            className="action-btn"
                          >
                            {internship.verified ? 'View' : 'Verify'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <Link to="/coordinator/internships" className="btn btn-primary">
              View All Internships
            </Link>
            <Link to="/coordinator/reports" className="btn btn-secondary">
              Generate Reports
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;