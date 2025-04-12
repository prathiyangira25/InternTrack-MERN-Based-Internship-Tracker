import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { internshipService } from '../../services/api';
import BackButton from '../common/BackButton';

const Reports = ({ user }) => {
  const [reportType, setReportType] = useState('batchwise');
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    batch: '',
    academicYear: '',
    companyName: '',
    minStipend: '',
    internshipLocation: '',
    internshipType: '',
    obtainedThroughCDC: ''
  });

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Create filters object based on report type
      let queryFilters = {};
      
      switch (reportType) {
        case 'batchwise':
          if (filters.batch) {
            queryFilters.batch = filters.batch;
          }
          break;
        case 'cdc':
          queryFilters.obtainedThroughCDC = true;
          break;
        case 'non-cdc':
          queryFilters.obtainedThroughCDC = false;
          break;
        case 'academic':
          queryFilters.internshipType = 'Academic';
          break;
        case 'industry':
          queryFilters.internshipType = 'Industry';
          break;
        case 'academic-year':
          if (filters.academicYear) {
            queryFilters.academicYear = filters.academicYear;
          }
          break;
        case 'company-wise':
          if (filters.companyName) {
            queryFilters.companyName = filters.companyName;
          }
          break;
        case 'high-stipend':
          queryFilters.minStipend = filters.minStipend || 100000; // Default 1 Lakh
          break;
        case 'abroad':
          queryFilters.internshipLocation = 'Abroad';
          break;
        case 'india':
          queryFilters.internshipLocation = 'India';
          break;
        default:
          break;
      }
      
      const response = await internshipService.getInternships(queryFilters);
      
      if (response.success) {
        setReportData(response.data);
      } else {
        toast.error('Failed to load report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle report type change
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Generate report
  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Export report as CSV
  const exportCSV = () => {
    if (reportData.length === 0) {
      toast.warning('No data to export');
      return;
    }
    
    // Create CSV headers
    const headers = [
      'Registration Number',
      'Name',
      'Batch',
      'Company',
      'Internship Type',
      'CDC',
      'Location',
      'Start Date',
      'End Date',
      'Duration (Days)',
      'Stipend (₹)',
      'Academic Year',
      'Status'
    ].join(',');
    
    // Create CSV rows
    const rows = reportData.map(internship => [
      internship.registrationNumber,
      `"${internship.student?.name || internship.name}"`,
      internship.batch,
      `"${internship.companyName}"`,
      internship.internshipType,
      internship.obtainedThroughCDC ? 'Yes' : 'No',
      internship.internshipLocation,
      formatDate(internship.internshipStartDate),
      formatDate(internship.internshipEndDate),
      internship.duration,
      internship.stipend,
      internship.academicYear,
      internship.verified ? 'Verified' : 'Pending'
    ].join(','));
    
    // Combine headers and rows
    const csvContent = `${headers}\n${rows.join('\n')}`;
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}-report-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    // Add link to the document and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render report filter form based on selected report type
  const renderReportFilters = () => {
    switch (reportType) {
      case 'batchwise':
        return (
          <div className="report-filter">
            <label htmlFor="batch">Batch:</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
              placeholder="E.g., 2022-26"
            />
          </div>
        );
      case 'academic-year':
        return (
          <div className="report-filter">
            <label htmlFor="academicYear">Academic Year:</label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
              placeholder="E.g., 2023-2024"
            />
          </div>
        );
      case 'company-wise':
        return (
          <div className="report-filter">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={filters.companyName}
              onChange={handleFilterChange}
              placeholder="Enter company name"
            />
          </div>
        );
      case 'high-stipend':
        return (
          <div className="report-filter">
            <label htmlFor="minStipend">Minimum Stipend (₹):</label>
            <input
              type="number"
              id="minStipend"
              name="minStipend"
              value={filters.minStipend}
              onChange={handleFilterChange}
              placeholder="Default: 100,000"
              min="0"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reports-container">
      <BackButton />
      <h2>Generate Reports</h2>
      
      <div className="report-generator">
        <form onSubmit={handleGenerateReport} className="report-form">
          <div className="form-group">
            <label htmlFor="reportType">Report Type:</label>
            <select
              id="reportType"
              value={reportType}
              onChange={handleReportTypeChange}
              required
            >
              <option value="batchwise">List Students Batchwise</option>
              <option value="cdc">List Students with CDC Internships</option>
              <option value="non-cdc">List Students with Non-CDC Internships</option>
              <option value="academic">List Students with Academic Internships</option>
              <option value="industry">List Students with Industry Internships</option>
              <option value="academic-year">List Students by Academic Year</option>
              <option value="company-wise">List Students by Company</option>
              <option value="high-stipend">List Students with High Stipend</option>
              <option value="abroad">List Students with Internships Abroad</option>
              <option value="india">List Students with Internships in India</option>
            </select>
          </div>
          
          {renderReportFilters()}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
      
      {reportData.length > 0 && (
        <div className="report-results">
          <div className="results-header">
            <h3>
              {reportType === 'batchwise' && `Students from Batch ${filters.batch || 'All Batches'}`}
              {reportType === 'cdc' && 'Students with CDC Internships'}
              {reportType === 'non-cdc' && 'Students with Non-CDC Internships'}
              {reportType === 'academic' && 'Students with Academic Internships'}
              {reportType === 'industry' && 'Students with Industry Internships'}
              {reportType === 'academic-year' && `Students in Academic Year ${filters.academicYear || 'All Years'}`}
              {reportType === 'company-wise' && `Students at ${filters.companyName || 'All Companies'}`}
              {reportType === 'high-stipend' && `Students with Stipend ≥ ₹${filters.minStipend || '100,000'}`}
              {reportType === 'abroad' && 'Students with Internships Abroad'}
              {reportType === 'india' && 'Students with Internships in India'}
            </h3>
            <div className="results-actions">
              <button onClick={exportCSV} className="btn btn-secondary">
                Export as CSV
              </button>
            </div>
          </div>
          
          <div className="results-count">
            <p>Found {reportData.length} records</p>
          </div>
          
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Reg. No</th>
                  <th>Name</th>
                  <th>Batch</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>CDC</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Stipend</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(internship => (
                  <tr key={internship._id}>
                    <td>{internship.registrationNumber}</td>
                    <td>{internship.student?.name || internship.name}</td>
                    <td>{internship.batch}</td>
                    <td>{internship.companyName}</td>
                    <td>{internship.internshipType}</td>
                    <td>{internship.obtainedThroughCDC ? 'Yes' : 'No'}</td>
                    <td>{internship.internshipLocation}</td>
                    <td>{internship.duration} days</td>
                    <td>₹{internship.stipend}</td>
                    <td>{internship.academicYear}</td>
                    <td>
                      <span className={`status-badge ${internship.verified ? 'verified' : 'pending'}`}>
                        {internship.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;