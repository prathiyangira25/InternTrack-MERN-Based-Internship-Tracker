import React, { useState } from 'react';

const SearchForm = ({ onSearch, defaultFilters = {} }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    batch: '',
    academicYear: '',
    internshipType: '',
    internshipLocation: '',
    verified: '',
    ...defaultFilters
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
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      batch: '',
      academicYear: '',
      internshipType: '',
      internshipLocation: '',
      verified: ''
    });
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Search by name, company, etc."
            className="search-input"
          />
        </div>
        
        <div className="form-group">
          <select
            name="batch"
            value={filters.batch}
            onChange={handleChange}
          >
            <option value="">All Batches</option>
            <option value="2022-26">2022-26</option>
            <option value="2021-25">2021-25</option>
            <option value="2020-24">2020-24</option>
            <option value="2019-23">2019-23</option>
          </select>
        </div>
        
        <div className="form-group">
          <select
            name="academicYear"
            value={filters.academicYear}
            onChange={handleChange}
          >
            <option value="">All Academic Years</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2021-2022">2021-2022</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <select
            name="internshipType"
            value={filters.internshipType}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="Industry">Industry</option>
            <option value="Academic">Academic</option>
          </select>
        </div>
        
        <div className="form-group">
          <select
            name="internshipLocation"
            value={filters.internshipLocation}
            onChange={handleChange}
          >
            <option value="">All Locations</option>
            <option value="India">India</option>
            <option value="Abroad">Abroad</option>
          </select>
        </div>
        
        <div className="form-group">
          <select
            name="verified"
            value={filters.verified}
            onChange={handleChange}
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button type="button" onClick={handleReset} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchForm;