import React, { useState, useEffect } from 'react';
import { validateInternshipForm } from '../../services/validation';

const InternshipForm = ({ 
  initialData, 
  onSubmit, 
  buttonText = 'Submit', 
  isLoading = false,
  readOnly = false
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    internshipType: 'Industry',
    obtainedThroughCDC: false,
    internshipLocation: 'India',
    internshipStartDate: '',
    internshipEndDate: '',
    stipend: '',
    academicYear: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const { isValid, errors: validationErrors } = validateInternshipForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    // Call the submit handler passed from parent
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="internship-form">
      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={errors.companyName ? 'input-error' : ''}
          placeholder="Enter company name"
          required
          readOnly={readOnly}
        />
        {errors.companyName && <p className="error-message">{errors.companyName}</p>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="internshipType">Internship Type</label>
          <select
            id="internshipType"
            name="internshipType"
            value={formData.internshipType}
            onChange={handleChange}
            disabled={readOnly}
            required
          >
            <option value="Industry">Industry</option>
            <option value="Academic">Academic</option>
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="obtainedThroughCDC"
              checked={formData.obtainedThroughCDC}
              onChange={handleChange}
              disabled={readOnly}
            />
            Obtained through CDC
          </label>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="internshipLocation">Internship Location</label>
          <select
            id="internshipLocation"
            name="internshipLocation"
            value={formData.internshipLocation}
            onChange={handleChange}
            disabled={readOnly}
            required
          >
            <option value="India">India</option>
            <option value="Abroad">Abroad</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="stipend">Stipend (₹)</label>
          <input
            type="number"
            id="stipend"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            className={errors.stipend ? 'input-error' : ''}
            min="0"
            placeholder="Enter stipend amount"
            required
            readOnly={readOnly}
          />
          {errors.stipend && <p className="error-message">{errors.stipend}</p>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="internshipStartDate">Start Date</label>
          <input
            type="date"
            id="internshipStartDate"
            name="internshipStartDate"
            value={formData.internshipStartDate ? formData.internshipStartDate.slice(0, 10) : ''}
            onChange={handleChange}
            className={errors.internshipStartDate ? 'input-error' : ''}
            required
            readOnly={readOnly}
          />
          {errors.internshipStartDate && <p className="error-message">{errors.internshipStartDate}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="internshipEndDate">End Date</label>
          <input
            type="date"
            id="internshipEndDate"
            name="internshipEndDate"
            value={formData.internshipEndDate ? formData.internshipEndDate.slice(0, 10) : ''}
            onChange={handleChange}
            className={errors.internshipEndDate ? 'input-error' : ''}
            required
            readOnly={readOnly}
          />
          {errors.internshipEndDate && <p className="error-message">{errors.internshipEndDate}</p>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="academicYear">Academic Year</label>
        <input
          type="text"
          id="academicYear"
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
          className={errors.academicYear ? 'input-error' : ''}
          placeholder="Format: YYYY-YYYY (e.g., 2023-2024)"
          required
          readOnly={readOnly}
        />
        {errors.academicYear && <p className="error-message">{errors.academicYear}</p>}
      </div>
      
      {!readOnly && (
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : buttonText}
          </button>
        </div>
      )}
    </form>
  );
};

export default InternshipForm;