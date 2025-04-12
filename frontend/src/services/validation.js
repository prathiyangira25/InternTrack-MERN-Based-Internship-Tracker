// Validation rules for different form fields

// Email validation
export const validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };
  
  // Registration number validation (13 digits)
export const validateRegistrationNumber = (regNo) => {
  const regex = /^\d{13}$/;  // Exactly 13 digits
  return regex.test(regNo);
};
  
  // Password validation (min 6 characters)
  export const validatePassword = (password) => {
    return password && password.length >= 6;
  };
  
  // Mobile number validation (10 digits)
  export const validateMobileNumber = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };
  
  // Batch validation (format: YYYY-YY)
  export const validateBatch = (batch) => {
    const regex = /^\d{4}-\d{2}$/;
    return regex.test(batch);
  };
  
  // Company name validation (non-empty)
  export const validateCompanyName = (name) => {
    return name && name.trim().length > 0;
  };
  
  // Stipend validation (positive number)
  export const validateStipend = (stipend) => {
    return !isNaN(stipend) && parseFloat(stipend) >= 0;
  };
  
  // Date validation (non-empty and valid date)
  export const validateDate = (date) => {
    if (!date) return false;
    
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  };
  
  // Date range validation (start date before end date)
  export const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return start < end;
  };
  
  // PDF file validation
  export const validatePDFFile = (file) => {
    if (!file) return false;
    
    // Check file type
    return file.type === 'application/pdf';
  };
  
  // Validate file size (max size in bytes)
  export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
    if (!file) return false;
    
    return file.size <= maxSize;
  };
  
  // Form validation for internship submission
  export const validateInternshipForm = (formData) => {
    const errors = {};
    
    if (!validateRegistrationNumber(formData.registrationNumber)) {
      errors.registrationNumber = 'Registration number must be 4-10 digits';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validateMobileNumber(formData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }
    
    if (!validateBatch(formData.batch)) {
      errors.batch = 'Batch must be in format YYYY-YY (e.g., 2022-26)';
    }
    
    if (!validateCompanyName(formData.companyName)) {
      errors.companyName = 'Please enter a company name';
    }
    
    if (!validateStipend(formData.stipend)) {
      errors.stipend = 'Stipend must be a positive number';
    }
    
    if (!validateDate(formData.internshipStartDate)) {
      errors.internshipStartDate = 'Please enter a valid start date';
    }
    
    if (!validateDate(formData.internshipEndDate)) {
      errors.internshipEndDate = 'Please enter a valid end date';
    }
    
    if (formData.internshipStartDate && formData.internshipEndDate) {
      if (!validateDateRange(formData.internshipStartDate, formData.internshipEndDate)) {
        errors.internshipEndDate = 'End date must be after start date';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Form validation for login
  export const validateLoginForm = (formData) => {
    const errors = {};
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
 // Form validation for registration
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Please enter your name';
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // Only validate registration number, batch, and mobile for students
  if (formData.role === 'student') {
    if (!validateRegistrationNumber(formData.registrationNumber)) {
      errors.registrationNumber = 'Registration number must be 13 digits';
    }
    
    if (!validateBatch(formData.batch)) {
      errors.batch = 'Batch must be in format YYYY-YY (e.g., 2022-26)';
    }
    
    if (!validateMobileNumber(formData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};