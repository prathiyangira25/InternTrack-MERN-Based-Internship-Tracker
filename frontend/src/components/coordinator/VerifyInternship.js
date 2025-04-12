import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { internshipService } from '../../services/api';
import BackButton from '../common/BackButton';

const VerifyInternship = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationComments, setVerificationComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch internship details
  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        setIsLoading(true);
        const response = await internshipService.getInternship(id);
        
        if (response.success) {
          setInternship(response.data);
        } else {
          toast.error('Failed to load internship details');
          navigate('/coordinator/internships');
        }
      } catch (error) {
        console.error('Error fetching internship details:', error);
        toast.error('Failed to load internship details');
        navigate('/coordinator/internships');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInternshipDetails();
  }, [id, navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle verification
  const handleVerifyInternship = async () => {
    try {
      if (!window.confirm('Are you sure you want to verify this internship?')) {
        return;
      }
      
      setIsSubmitting(true);
      
      const response = await internshipService.verifyInternship(id, verificationComments);
      
      if (response.success) {
        toast.success('Internship verified successfully');
        setInternship(response.data);
      } else {
        toast.error('Failed to verify internship');
      }
    } catch (error) {
      console.error('Error verifying internship:', error);
      toast.error('Failed to verify internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    setVerificationComments(e.target.value);
  };

  // Handle back to list
  const handleBackToList = () => {
    navigate('/coordinator/internships');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading internship details...</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="error-container">
        <p>Internship not found.</p>
        <button onClick={handleBackToList} className="btn btn-primary">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="verify-internship-container">
      <BackButton />
      <div className="verify-internship-card">
        <div className="card-header">
          <h2>Internship Details</h2>
          <span className={`status-badge ${internship.verified ? 'verified' : 'pending'}`}>
            {internship.verified ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
        
        {internship.verified && (
          <div className="verification-info">
            <p>Verified by: {internship.verifiedBy?.name || 'N/A'}</p>
            <p>Verified on: {formatDate(internship.verificationDate)}</p>
            {internship.verificationComments && (
              <p>Comments: {internship.verificationComments}</p>
            )}
          </div>
        )}
        
        <div className="internship-section">
          <h3>Student Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{internship.student?.name || internship.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Registration No:</span>
              <span className="value">{internship.registrationNumber}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{internship.student?.email || internship.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Mobile:</span>
              <span className="value">{internship.student?.mobileNumber || internship.mobileNumber}</span>
            </div>
            <div className="detail-item">
              <span className="label">Batch:</span>
              <span className="value">{internship.batch}</span>
            </div>
          </div>
        </div>
        
        <div className="internship-section">
          <h3>Internship Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Company:</span>
              <span className="value">{internship.companyName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{internship.internshipType}</span>
            </div>
            <div className="detail-item">
              <span className="label">Obtained through CDC:</span>
              <span className="value">{internship.obtainedThroughCDC ? 'Yes' : 'No'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{internship.internshipLocation}</span>
            </div>
            <div className="detail-item">
              <span className="label">Start Date:</span>
              <span className="value">{formatDate(internship.internshipStartDate)}</span>
            </div>
            <div className="detail-item">
              <span className="label">End Date:</span>
              <span className="value">{formatDate(internship.internshipEndDate)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Duration:</span>
              <span className="value">{internship.duration} days</span>
            </div>
            <div className="detail-item">
              <span className="label">Stipend:</span>
              <span className="value">₹{internship.stipend}</span>
            </div>
            <div className="detail-item">
              <span className="label">Academic Year:</span>
              <span className="value">{internship.academicYear}</span>
            </div>
            <div className="detail-item">
              <span className="label">Submitted:</span>
              <span className="value">{formatDate(internship.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="internship-section">
          <h3>Documents</h3>
          <div className="documents-grid">
            <div className="document-item">
              <span className="label">Offer Letter:</span>
              <a 
                href={internship.offerLetterFile.webViewLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="document-link"
              >
                View Document
              </a>
            </div>
            
            {internship.permissionLetterFile && (
              <div className="document-item">
                <span className="label">Permission Letter:</span>
                <a 
                  href={internship.permissionLetterFile.webViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="document-link"
                >
                  View Document
                </a>
              </div>
            )}
            
            {internship.completionCertificateFile && (
              <div className="document-item">
                <span className="label">Completion Certificate:</span>
                <a 
                  href={internship.completionCertificateFile.webViewLink} 
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
        
        {!internship.verified && (
          <div className="verification-section">
            <h3>Verification</h3>
            <div className="verification-form">
              <div className="form-group">
                <label htmlFor="verificationComments">Comments (Optional)</label>
                <textarea
                  id="verificationComments"
                  name="verificationComments"
                  value={verificationComments}
                  onChange={handleCommentChange}
                  placeholder="Add verification comments if needed"
                  rows={3}
                ></textarea>
              </div>
              
              <button 
                onClick={handleVerifyInternship} 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Internship'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyInternship;