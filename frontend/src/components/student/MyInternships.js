import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { internshipService } from '../../services/api';
import BackButton from '../common/BackButton';

const MyInternships = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isViewMode, setIsViewMode] = useState(true);
  const [editFormData, setEditFormData] = useState({});

  // Extract internship ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const internshipId = params.get('id');
    
    if (internshipId) {
      fetchInternshipDetails(internshipId);
    } else {
      fetchInternships();
    }
  }, [location.search]);

  // Fetch all internships for the student
  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const response = await internshipService.getInternships();
      
      if (response.success) {
        setInternships(response.data);
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

  // Fetch details for a specific internship
  const fetchInternshipDetails = async (internshipId) => {
    try {
      setIsLoading(true);
      const response = await internshipService.getInternship(internshipId);
      
      if (response.success) {
        setSelectedInternship(response.data);
        setEditFormData(response.data);
      } else {
        toast.error('Failed to load internship details');
        fetchInternships();
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
      toast.error('Failed to load internship details');
      fetchInternships();
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedInternship(null);
    setIsViewMode(true);
    navigate('/student/my-internships');
  };

  // Toggle between view and edit mode
  const toggleEditMode = () => {
    if (!isViewMode) {
      // If switching back to view mode, reset form data
      setEditFormData(selectedInternship);
    }
    setIsViewMode(!isViewMode);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle internship update
  const handleUpdateInternship = async () => {
    try {
      setIsLoading(true);
      
      // Prepare data for update
      const updateData = {
        companyName: editFormData.companyName,
        internshipType: editFormData.internshipType,
        obtainedThroughCDC: editFormData.obtainedThroughCDC,
        internshipLocation: editFormData.internshipLocation,
        internshipStartDate: editFormData.internshipStartDate,
        internshipEndDate: editFormData.internshipEndDate,
        stipend: parseFloat(editFormData.stipend),
        academicYear: editFormData.academicYear
      };
      
      const response = await internshipService.updateInternship(selectedInternship._id, updateData);
      
      if (response.success) {
        toast.success('Internship updated successfully');
        setSelectedInternship(response.data);
        setIsViewMode(true);
        
        // Also update in the list
        setInternships(prevInternships => 
          prevInternships.map(intern => 
            intern._id === response.data._id ? response.data : intern
          )
        );
      } else {
        toast.error('Failed to update internship');
      }
    } catch (error) {
      console.error('Error updating internship:', error);
      toast.error('Failed to update internship');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInternship = async () => {
    if (!window.confirm('Are you sure you want to delete this internship record?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if there's a token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication failed. Please log in again.');
        navigate('/');
        return;
      }
      
      // Log the ID being deleted
      console.log(`Attempting to delete internship with ID: ${selectedInternship._id}`);
      
      const response = await internshipService.deleteInternship(selectedInternship._id);
      
      // Log the response
      console.log('Delete response:', response);
      
      if (response.success) {
        toast.success('Internship deleted successfully');
        handleBackToList();
        
        // Also remove from the list
        setInternships(prevInternships => 
          prevInternships.filter(intern => intern._id !== selectedInternship._id)
        );
      } else {
        toast.error(response.message || 'Failed to delete internship');
      }
    } catch (error) {
      console.error('Error deleting internship details:', error);
      console.error('Response data:', error.response?.data);
      toast.error('Failed to delete internship: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Render internship list
  const renderInternshipList = () => (
    <div className="internships-list">
      <h2>My Internships</h2>
      
      {internships.length === 0 ? (
        <div className="empty-state">
          <p>You haven't submitted any internships yet.</p>
          <button 
            onClick={() => navigate('/student/submit')}
            className="btn btn-primary"
          >
            Submit New Internship
          </button>
        </div>
      ) : (
        <>
          <button 
            onClick={() => navigate('/student/submit')}
            className="btn btn-primary new-btn"
          >
            Submit New Internship
          </button>
          
          <div className="internship-cards">
            {internships.map(internship => (
              <div 
                key={internship._id} 
                className={`internship-card ${internship.verified ? 'verified' : 'pending'}`}
                onClick={() => navigate(`/student/my-internships?id=${internship._id}`)}
              >
                <div className="internship-header">
                  <h3>{internship.companyName}</h3>
                  <span className={`status ${internship.verified ? 'verified' : 'pending'}`}>
                    {internship.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                <div className="internship-details">
                  <p>
                    <span className="label">Duration:</span>
                    <span className="value">{internship.duration} days</span>
                  </p>
                  <p>
                    <span className="label">Stipend:</span>
                    <span className="value">₹{internship.stipend}</span>
                  </p>
                  <p>
                    <span className="label">Type:</span>
                    <span className="value">{internship.internshipType}</span>
                  </p>
                </div>
                
                <div className="internship-dates">
                  <p>
                    <span className="label">From:</span>
                    <span className="value">{formatDate(internship.internshipStartDate)}</span>
                  </p>
                  <p>
                    <span className="label">To:</span>
                    <span className="value">{formatDate(internship.internshipEndDate)}</span>
                  </p>
                </div>
                
                <button className="view-details-btn">View Details</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Render internship details in view mode
  const renderInternshipDetails = () => (
    <div className="internship-details-container">
      <BackButton />
      <div className="internship-details-card">
        <div className="details-header">
          <h2>{selectedInternship.companyName}</h2>
          <div className="status-badge">
            <span className={`status ${selectedInternship.verified ? 'verified' : 'pending'}`}>
              {selectedInternship.verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
        
        {selectedInternship.verified && (
          <div className="verification-info">
            <p>Verified on: {formatDate(selectedInternship.verificationDate)}</p>
            {selectedInternship.verificationComments && (
              <p>Comments: {selectedInternship.verificationComments}</p>
            )}
          </div>
        )}
        
        <div className="details-section">
          <h3>Internship Information</h3>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Internship Type:</span>
              <span className="value">{selectedInternship.internshipType}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Obtained through CDC:</span>
              <span className="value">{selectedInternship.obtainedThroughCDC ? 'Yes' : 'No'}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{selectedInternship.internshipLocation}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Start Date:</span>
              <span className="value">{formatDate(selectedInternship.internshipStartDate)}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">End Date:</span>
              <span className="value">{formatDate(selectedInternship.internshipEndDate)}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Duration:</span>
              <span className="value">{selectedInternship.duration} days</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Stipend:</span>
              <span className="value">₹{selectedInternship.stipend}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Academic Year:</span>
              <span className="value">{selectedInternship.academicYear}</span>
            </div>
          </div>
        </div>
        
        <div className="details-section">
          <h3>Submitted Documents</h3>
          
          <div className="documents-grid">
            <div className="document-item">
              <span className="label">Offer Letter:</span>
              <a 
                href={selectedInternship.offerLetterFile.webViewLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="document-link"
              >
                View Document
              </a>
            </div>
            
            {selectedInternship.permissionLetterFile && (
              <div className="document-item">
                <span className="label">Permission Letter:</span>
                <a 
                  href={selectedInternship.permissionLetterFile.webViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="document-link"
                >
                  View Document
                </a>
              </div>
            )}
            
            {selectedInternship.completionCertificateFile && (
              <div className="document-item">
                <span className="label">Completion Certificate:</span>
                <a 
                  href={selectedInternship.completionCertificateFile.webViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="document-link"
                >
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="details-actions">
          {!selectedInternship.verified && (
            <>
              <button onClick={toggleEditMode} className="btn btn-secondary">
                {isViewMode ? 'Edit' : 'Cancel'}
              </button>
              <button onClick={handleDeleteInternship} className="btn btn-danger">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Render internship edit form
  const renderEditForm = () => (
    <div className="internship-details-container">
      <button onClick={handleBackToList} className="back-btn">
        &larr; Back to List
      </button>
      
      <div className="internship-edit-card">
        <h2>Edit Internship</h2>
        
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={editFormData.companyName}
              onChange={handleEditChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="internshipType">Internship Type</label>
              <select
                id="internshipType"
                name="internshipType"
                value={editFormData.internshipType}
                onChange={handleEditChange}
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
                  checked={editFormData.obtainedThroughCDC}
                  onChange={handleEditChange}
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
                value={editFormData.internshipLocation}
                onChange={handleEditChange}
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
                value={editFormData.stipend}
                onChange={handleEditChange}
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="internshipStartDate">Start Date</label>
              <input
                type="date"
                id="internshipStartDate"
                name="internshipStartDate"
                value={editFormData.internshipStartDate ? editFormData.internshipStartDate.slice(0, 10) : ''}
                onChange={handleEditChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="internshipEndDate">End Date</label>
              <input
                type="date"
                id="internshipEndDate"
                name="internshipEndDate"
                value={editFormData.internshipEndDate ? editFormData.internshipEndDate.slice(0, 10) : ''}
                onChange={handleEditChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="academicYear">Academic Year</label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={editFormData.academicYear}
              onChange={handleEditChange}
              placeholder="Format: YYYY-YYYY (e.g., 2023-2024)"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={toggleEditMode}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleUpdateInternship}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Render based on the current state
  if (selectedInternship) {
    return isViewMode ? renderInternshipDetails() : renderEditForm();
  }

  return renderInternshipList();
};

export default MyInternships;