// Validator utilities for the InternTrack application

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };
  
  /**
   * Validate registration number format
   * @param {string} regNo - Registration number to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateRegistrationNumber = (regNo) => {
    const regex = /^\d{13}$/;  // Exactly 13 digits
    return regex.test(regNo);
  };
  
  /**
   * Validate batch format (YYYY-YY)
   * @param {string} batch - Batch to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateBatch = (batch) => {
    const regex = /^\d{4}-\d{2}$/;
    return regex.test(batch);
  };
  
  /**
   * Validate mobile number (10 digits)
   * @param {string} mobile - Mobile number to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateMobileNumber = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };
  
  /**
   * Validate academic year format (YYYY-YYYY)
   * @param {string} academicYear - Academic year to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateAcademicYear = (academicYear) => {
    const regex = /^\d{4}-\d{4}$/;
    
    if (!regex.test(academicYear)) {
      return false;
    }
    
    // Ensure second year is one more than first year
    const [firstYear, secondYear] = academicYear.split('-').map(Number);
    return secondYear === firstYear + 1;
  };
  
  /**
   * Validate date in YYYY-MM-DD format
   * @param {string} date - Date string to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateDate = (date) => {
    // Check if date is in correct format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }
    
    // Check if date is valid
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };
  
  /**
   * Validate date range (start date should be before end date)
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateDateRange = (startDate, endDate) => {
    if (!validateDate(startDate) || !validateDate(endDate)) {
      return false;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return start < end;
  };
  
  /**
   * Validate stipend (should be a positive number)
   * @param {number|string} stipend - Stipend amount
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateStipend = (stipend) => {
    const amount = Number(stipend);
    return !isNaN(amount) && amount >= 0;
  };
  
  /**
   * Validate internship type
   * @param {string} type - Internship type to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateInternshipType = (type) => {
    return ['Academic', 'Industry'].includes(type);
  };
  
  /**
   * Validate internship location
   * @param {string} location - Internship location to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateInternshipLocation = (location) => {
    return ['India', 'Abroad'].includes(location);
  };
  
  /**
   * Validate file size
   * @param {number} fileSize - File size in bytes
   * @param {number} maxSize - Maximum allowed size in bytes
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateFileSize = (fileSize, maxSize = 5 * 1024 * 1024) => {
    return fileSize <= maxSize;
  };
  
  /**
   * Validate file type
   * @param {string} mimeType - File MIME type
   * @param {Array<string>} allowedTypes - Allowed MIME types
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateFileType = (mimeType, allowedTypes = ['application/pdf']) => {
    return allowedTypes.includes(mimeType);
  };
  
  /**
   * Validate internship data
   * @param {Object} data - Internship data to validate
   * @returns {Object} - Validation result with errors if any
   */

  // Add sanitization function
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input.replace(/[<>&'"]/g, '');
  }
  return input;
};


  const validateInternshipData = (data) => {
    const errors = {};
    
    const sanitizedData = {};
  Object.keys(data).forEach(key => {
    sanitizedData[key] = sanitizeInput(data[key]);
  });


    // Required fields
    if (!data.registrationNumber) {
      errors.registrationNumber = 'Registration number is required';
    } else if (!validateRegistrationNumber(data.registrationNumber)) {
      errors.registrationNumber = 'Registration number must be 4-10 digits';
    }
    
    if (!data.name) {
      errors.name = 'Name is required';
    }
    
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!data.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobileNumber(data.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }
    
    if (!data.batch) {
      errors.batch = 'Batch is required';
    } else if (!validateBatch(data.batch)) {
      errors.batch = 'Batch format should be YYYY-YY (e.g., 2022-26)';
    }
    
    if (!data.companyName) {
      errors.companyName = 'Company name is required';
    }
    
    if (!data.internshipType) {
      errors.internshipType = 'Internship type is required';
    } else if (!validateInternshipType(data.internshipType)) {
      errors.internshipType = 'Internship type must be either Academic or Industry';
    }
    
    if (data.obtainedThroughCDC === undefined) {
      errors.obtainedThroughCDC = 'CDC information is required';
    }
    
    if (!data.internshipLocation) {
      errors.internshipLocation = 'Internship location is required';
    } else if (!validateInternshipLocation(data.internshipLocation)) {
      errors.internshipLocation = 'Internship location must be either India or Abroad';
    }
    
    if (!data.internshipStartDate) {
      errors.internshipStartDate = 'Start date is required';
    } else if (!validateDate(data.internshipStartDate)) {
      errors.internshipStartDate = 'Invalid start date format';
    }
    
    if (!data.internshipEndDate) {
      errors.internshipEndDate = 'End date is required';
    } else if (!validateDate(data.internshipEndDate)) {
      errors.internshipEndDate = 'Invalid end date format';
    }
    
    if (data.internshipStartDate && data.internshipEndDate) {
      if (!validateDateRange(data.internshipStartDate, data.internshipEndDate)) {
        errors.internshipEndDate = 'End date must be after start date';
      }
    }
    
    if (data.stipend === undefined) {
      errors.stipend = 'Stipend is required';
    } else if (!validateStipend(data.stipend)) {
      errors.stipend = 'Stipend must be a positive number';
    }
    
    if (!data.academicYear) {
      errors.academicYear = 'Academic year is required';
    } else if (!validateAcademicYear(data.academicYear)) {
      errors.academicYear = 'Academic year format should be YYYY-YYYY (e.g., 2023-2024)';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  module.exports = {
    validateEmail,
    validateRegistrationNumber,
    validateBatch,
    validateMobileNumber,
    validateAcademicYear,
    validateDate,
    validateDateRange,
    validateStipend,
    validateInternshipType,
    validateInternshipLocation,
    validateFileSize,
    validateFileType,
    validateInternshipData
  };