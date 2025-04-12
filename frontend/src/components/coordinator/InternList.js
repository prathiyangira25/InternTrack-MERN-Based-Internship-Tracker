import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { internshipService } from '../../services/api';
import BackButton from '../common/BackButton';

const InternList = ({ user }) => {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    batch: '',
    companyName: '',
    academicYear: '',
    internshipType: '',
    obtainedThroughCDC: '',
    internshipLocation: '',
    verified: '',
    minStipend: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch internships with applied filters
  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortDirection
      };
      
      const response = await internshipService.getInternships(queryParams);
      
      if (response.success) {
        setInternships(response.data);
        setPagination({
          ...pagination,
          total: response.count
        });
      } else {
        toast.error('Failed to load internship data');
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internship data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load internships on component mount and when filters/pagination changes
  useEffect(() => {
    fetchInternships();
  }, [filters, pagination.page, pagination.limit, sortBy, sortDirection]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Reset to first page when filters change
    setPagination({
      ...pagination,
      page: 1
    });
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort direction if same field is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      batch: '',
      companyName: '',
      academicYear: '',
      internshipType: '',
      obtainedThroughCDC: '',
      internshipLocation: '',
      verified: '',
      minStipend: ''
    });
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="intern-list-container">
      <BackButton />
      <h2>Internship List</h2>
      
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="batch">Batch</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
              placeholder="E.g., 2022-26"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={filters.companyName}
              onChange={handleFilterChange}
              placeholder="Enter company name"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="academicYear">Academic Year</label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
              placeholder="E.g., 2023-2024"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="internshipType">Internship Type</label>
            <select
              id="internshipType"
              name="internshipType"
              value={filters.internshipType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Industry">Industry</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="obtainedThroughCDC">CDC Source</label>
            <select
              id="obtainedThroughCDC"
              name="obtainedThroughCDC"
              value={filters.obtainedThroughCDC}
              onChange={handleFilterChange}
            >
              <option value="">All Sources</option>
              <option value="true">CDC</option>
              <option value="false">Non-CDC</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="internshipLocation">Location</label>
            <select
              id="internshipLocation"
              name="internshipLocation"
              value={filters.internshipLocation}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="India">India</option>
              <option value="Abroad">Abroad</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="verified">Verification Status</label>
            <select
              id="verified"
              name="verified"
              value={filters.verified}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Pending</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minStipend">Minimum Stipend (₹)</label>
            <input
              type="number"
              id="minStipend"
              name="minStipend"
              value={filters.minStipend}
              onChange={handleFilterChange}
              placeholder="Enter amount"
              min="0"
            />
          </div>
        </div>
        
        <div className="filter-actions">
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <p>Loading internship data...</p>
        </div>
      ) : (
        <>
          {internships.length === 0 ? (
            <div className="empty-state">
              <p>No internships found matching the filter criteria.</p>
              <button onClick={handleResetFilters} className="btn btn-outline">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>Showing {internships.length} of {pagination.total} internships</p>
              </div>
              
              <div className="internships-table-container">
                <table className="internships-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSortChange('registrationNumber')}>
                        Reg. No.
                        {sortBy === 'registrationNumber' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('name')}>
                        Student Name
                        {sortBy === 'name' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('batch')}>
                        Batch
                        {sortBy === 'batch' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('companyName')}>
                        Company
                        {sortBy === 'companyName' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('internshipType')}>
                        Type
                        {sortBy === 'internshipType' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('stipend')}>
                        Stipend
                        {sortBy === 'stipend' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('internshipStartDate')}>
                        Start Date
                        {sortBy === 'internshipStartDate' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('internshipEndDate')}>
                        End Date
                        {sortBy === 'internshipEndDate' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange('verified')}>
                        Status
                        {sortBy === 'verified' && (
                          <span className={`sort-indicator ${sortDirection}`}></span>
                        )}
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internships.map(internship => (
                      <tr key={internship._id}>
                        <td>{internship.registrationNumber}</td>
                        <td>{internship.student?.name || internship.name}</td>
                        <td>{internship.batch}</td>
                        <td>{internship.companyName}</td>
                        <td>{internship.internshipType}</td>
                        <td>₹{internship.stipend}</td>
                        <td>{formatDate(internship.internshipStartDate)}</td>
                        <td>{formatDate(internship.internshipEndDate)}</td>
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
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className="pagination-btn"
                  >
                    First
                  </button>
                  
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {pagination.page} of {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                  
                  <button 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pagination.page === totalPages}
                    className="pagination-btn"
                  >
                    Last
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InternList;