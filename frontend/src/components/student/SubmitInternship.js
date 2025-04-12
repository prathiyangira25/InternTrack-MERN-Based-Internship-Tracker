import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { internshipService, fileService } from '../../services/api';
import { validateInternshipForm, validatePDFFile, validateFileSize } from '../../services/validation';
import BackButton from '../common/BackButton';

const SubmitInternship = ({ user }) => {
  const navigate = useNavigate();
  
  // Pre-fill form with user data
  const [formData, setFormData] = useState({
    registrationNumber: user?.registrationNumber || '',
    name: user?.name || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    batch: user?.batch || '',
    companyName: '',
    internshipType: 'Industry',
    obtainedThroughCDC: false,
    internshipLocation: 'India',
    internshipStartDate: '',
    internshipEndDate: '',
    stipend: '',
    academicYear: '',
    offerLetterFile: null,
    permissionLetterFile: null,
    completionCertificateFile: null
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileUploads, setFileUploads] = useState({
    offerLetter: null,
    permissionLetter: null,
    completionCertificate: null
  });
  
  // Calculate academic year based on current date
  const getCurrentAcademicYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // If we're in or after June, academic year is current year to next year
    // Otherwise it's previous year to current year
    if (month >= 5) {
      return `${year}-${year+1}`;
    } else {
      return `${year-1}-${year}`;
    }
  };
  
  // Set academic year on component mount
  useState(() => {
    setFormData(prevState => ({
      ...prevState,
      academicYear: getCurrentAcademicYear()
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: inputValue
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    // Validate file type (PDF only)
    if (!validatePDFFile(file)) {
      setErrors({
        ...errors,
        [name]: 'Only PDF files are allowed'
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (!validateFileSize(file)) {
      setErrors({
        ...errors,
        [name]: 'File size exceeds 5MB limit'
      });
      return;
    }
    
    // Store file in state
    setFormData({
      ...formData,
      [name]: file
    });
    
    // Clear error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate first step form data
      const { isValid, errors: validationErrors } = validateInternshipForm({
        registrationNumber: formData.registrationNumber,
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        batch: formData.batch,
        companyName: formData.companyName,
        internshipStartDate: formData.internshipStartDate,
        internshipEndDate: formData.internshipEndDate,
        stipend: formData.stipend
      });
      
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  

  const uploadFile = async (fileType, file) => {
    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in again.');
        toast.error('You need to be logged in to upload files');
        navigate('/');
        return null;
      }
      
      // Create form data for file upload
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);
      formDataForUpload.append('registrationNumber', formData.registrationNumber);
      formDataForUpload.append('batch', formData.batch);
      formDataForUpload.append('name', formData.name);
      formDataForUpload.append('companyName', formData.companyName);
      
      let response;
      
      // Upload the appropriate file
      if (fileType === 'offerLetter') {
        response = await fileService.uploadOfferLetter(formDataForUpload);
      } else if (fileType === 'permissionLetter') {
        response = await fileService.uploadPermissionLetter(formDataForUpload);
      } else if (fileType === 'completionCertificate') {
        response = await fileService.uploadCompletionCertificate(formDataForUpload);
      }
      
      if (response && response.success) {
        return response.fileDetails;
      }
      
      throw new Error('File upload failed');
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      if (error.response && error.response.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        navigate('/');
      } else {
        toast.error(`Failed to upload ${fileType}: ${error.message || 'Unknown error'}`);
      }
      throw error;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Upload offer letter (required)
      if (!formData.offerLetterFile) {
        setErrors({
          ...errors,
          offerLetterFile: 'Offer letter is required'
        });
        setIsLoading(false);
        return;
      }
      
      // Upload files first
      const offerLetterDetails = await uploadFile('offerLetter', formData.offerLetterFile);
      const token = localStorage.getItem('token');
  console.log('Token exists before upload:', !!token);
  console.log('Token value:', token);
      // Upload permission letter if provided
      let permissionLetterDetails = null;
      if (formData.permissionLetterFile) {
        permissionLetterDetails = await uploadFile('permissionLetter', formData.permissionLetterFile);
      }
      
      // Upload completion certificate if provided
      let completionCertificateDetails = null;
      if (formData.completionCertificateFile) {
        completionCertificateDetails = await uploadFile('completionCertificate', formData.completionCertificateFile);
      }
      
      // Prepare internship data for submission
      const internshipData = {
        registrationNumber: formData.registrationNumber,
        batch: formData.batch,
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        companyName: formData.companyName,
        internshipType: formData.internshipType,
        obtainedThroughCDC: formData.obtainedThroughCDC,
        internshipLocation: formData.internshipLocation,
        internshipStartDate: formData.internshipStartDate,
        internshipEndDate: formData.internshipEndDate,
        stipend: parseFloat(formData.stipend),
        academicYear: formData.academicYear,
        offerLetterFile: offerLetterDetails,
        permissionLetterFile: permissionLetterDetails,
        completionCertificateFile: completionCertificateDetails
      };
      
      // Submit internship record
      const response = await internshipService.createInternship(internshipData);
      
      if (response.success) {
        toast.success('Internship submitted successfully');
        navigate('/student/my-internships');
      } else {
        throw new Error(response.message || 'Failed to submit internship');
      }
    } catch (error) {
      console.error('Error submitting internship:', error);
      toast.error(error.message || 'Failed to submit internship');
      setIsLoading(false);
    }
  };

  // Render step 1 - Basic information
  const renderStep1 = () => (
    <div className="form-step">
      <h3>Step 1: Basic Information</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="registrationNumber">Registration Number</label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className={errors.registrationNumber ? 'input-error' : ''}
            readOnly
          />
          {errors.registrationNumber && (
  <p className="error-message">
    {errors.registrationNumber || "Registration number must be 13 digits"}
  </p>
)}
          </div>
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            readOnly
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            readOnly
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={errors.mobileNumber ? 'input-error' : ''}
            readOnly
          />
          {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="batch">Batch</label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className={errors.batch ? 'input-error' : ''}
            readOnly
          />
          {errors.batch && <p className="error-message">{errors.batch}</p>}
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
          />
          {errors.academicYear && <p className="error-message">{errors.academicYear}</p>}
        </div>
      </div>
      
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
            value={formData.internshipStartDate}
            onChange={handleChange}
            className={errors.internshipStartDate ? 'input-error' : ''}
            required
          />
          {errors.internshipStartDate && <p className="error-message">{errors.internshipStartDate}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="internshipEndDate">End Date</label>
          <input
            type="date"
            id="internshipEndDate"
            name="internshipEndDate"
            value={formData.internshipEndDate}
            onChange={handleChange}
            className={errors.internshipEndDate ? 'input-error' : ''}
            required
          />
          {errors.internshipEndDate && <p className="error-message">{errors.internshipEndDate}</p>}
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={handleNextStep}>
          Next: Upload Documents
        </button>
      </div>
    </div>
  );
  
  // Render step 2 - Document upload
  const renderStep2 = () => (
    <div className="form-step">
      <h3>Step 2: Upload Documents</h3>
      
      <div className="form-group file-upload">
        <label htmlFor="offerLetterFile">Offer Letter (Required)</label>
        <p className="file-description">
          Your offer letter should contain your name and registration number
        </p>
        <input
          type="file"
          id="offerLetterFile"
          name="offerLetterFile"
          onChange={handleFileChange}
          className={errors.offerLetterFile ? 'input-error' : ''}
          accept="application/pdf"
          required
        />
        {formData.offerLetterFile && (
          <p className="file-selected">
            Selected file: {formData.offerLetterFile.name}
          </p>
        )}
        {errors.offerLetterFile && <p className="error-message">{errors.offerLetterFile}</p>}
      </div>
      
      <div className="form-group file-upload">
        <label htmlFor="permissionLetterFile">Permission Letter (Optional)</label>
        <input
          type="file"
          id="permissionLetterFile"
          name="permissionLetterFile"
          onChange={handleFileChange}
          className={errors.permissionLetterFile ? 'input-error' : ''}
          accept="application/pdf"
        />
        {formData.permissionLetterFile && (
          <p className="file-selected">
            Selected file: {formData.permissionLetterFile.name}
          </p>
        )}
        {errors.permissionLetterFile && <p className="error-message">{errors.permissionLetterFile}</p>}
      </div>
      
      <div className="form-group file-upload">
        <label htmlFor="completionCertificateFile">Completion Certificate (Optional)</label>
        <input
          type="file"
          id="completionCertificateFile"
          name="completionCertificateFile"
          onChange={handleFileChange}
          className={errors.completionCertificateFile ? 'input-error' : ''}
          accept="application/pdf"
        />
        {formData.completionCertificateFile && (
          <p className="file-selected">
            Selected file: {formData.completionCertificateFile.name}
          </p>
        )}
        {errors.completionCertificateFile && <p className="error-message">{errors.completionCertificateFile}</p>}
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={handlePreviousStep}>
          Back
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading || !formData.offerLetterFile}
        >
          {isLoading ? 'Submitting...' : 'Submit Internship'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <BackButton />
      <h2>Submit Internship Details</h2>
      
      <div className="form-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      </div>
      
      <form onSubmit={handleSubmit} className="internship-form">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </form>
    </div>
  );
};

export default SubmitInternship;