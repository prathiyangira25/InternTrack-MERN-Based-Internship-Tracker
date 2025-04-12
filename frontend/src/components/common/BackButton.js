import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <button 
      onClick={goBack} 
      className="back-button"
      style={{
        display: 'block',
        margin: '10px 0',
        padding: '8px 16px',
        backgroundColor: '#e0e0e0',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: '#333',
      }}
    >
      ← Back
    </button>
  );
};

export default BackButton;