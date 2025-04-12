import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {currentYear} InternTrack - Sri Sivasubramaniya Nadar College of Engineering
        </p>
        <p className="footer-small">
          A platform for tracking and managing student internships
        </p>
      </div>
    </footer>
  );
};

export default Footer;