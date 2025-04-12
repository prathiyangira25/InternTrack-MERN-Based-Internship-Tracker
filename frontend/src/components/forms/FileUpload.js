import React, { useState } from 'react';
import { validatePDFFile, validateFileSize } from '../../services/validation';

const FileUpload = ({
  label,
  name,
  description,
  required = false,
  onChange,
  error,
  maxSize = 5 * 1024 * 1024 // 5MB default
}) => {
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFileName('');
      setFileError('');
      onChange(null);
      return;
    }
    
    // Validate file type (PDF only)
    if (!validatePDFFile(file)) {
      setFileName('');
      setFileError('Only PDF files are allowed');
      onChange(null);
      return;
    }
    
    // Validate file size
    if (!validateFileSize(file, maxSize)) {
      setFileName('');
      setFileError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      onChange(null);
      return;
    }
    
    // File is valid
    setFileName(file.name);
    setFileError('');
    onChange(file);
  };
  
  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        {label} {required && <span className="required">*</span>}
      </label>
      
      {description && (
        <p className="file-description">{description}</p>
      )}
      
      <div className="file-input-wrapper">
        <input
          type="file"
          name={name}
          accept="application/pdf"
          onChange={handleFileChange}
          className={fileError || error ? 'input-error' : ''}
          required={required}
        />
        
        <div className="file-input-custom">
          <span className="file-button">Browse</span>
          <span className="file-name">
            {fileName || 'No file selected'}
          </span>
        </div>
      </div>
      
      {(fileError || error) && (
        <p className="error-message">{fileError || error}</p>
      )}
      
      {fileName && (
        <p className="file-selected">
          Selected file: {fileName}
        </p>
      )}
    </div>
  );
};

export default FileUpload;