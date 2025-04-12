import React, { useState } from 'react';

const FilterForm = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    batch: '',
    companyName: '',
    academicYear: '',
    internshipType: '',
    obtainedThroughCDC: '',
    internshipLocation: '',
    verified: '',
    minStipend: '',
    ...initialFilters
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
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
    onFilter({});
  };

  return (
    <div className="filter-form-container">
      <h3>Filter Internships</h3>
      
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="batch">Batch</label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={filters.batch}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="E.g., 2023-2024"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="internshipType">Internship Type</label>
            <select
              id="internshipType"
              name="internshipType"
              value={filters.internshipType}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
            />
          </div>
        </div>
        
        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;