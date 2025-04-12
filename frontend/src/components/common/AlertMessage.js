import React, { useState, useEffect } from 'react';

const AlertMessage = ({ type = 'info', message, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, isVisible, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`alert-message alert-${type}`}>
      <div className="alert-content">{message}</div>
      <button onClick={handleClose} className="alert-close-btn">
        &times;
      </button>
    </div>
  );
};

export default AlertMessage;