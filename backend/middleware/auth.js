const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Add more detailed logging
exports.protect = async (req, res, next) => {
  console.log('Protecting route:', req.originalUrl);
  console.log('Headers received:', req.headers);
  
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted from header:', token ? token.substring(0, 15) + '...' : 'none');
  } else {
    console.log('No Bearer token in Authorization header');
  }

  // Check if token exists
  if (!token) {
    console.log('No token provided, returning 401');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route - no token provided' 
    });
  }

  try {
    // Verify token
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);

    // Get user from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ 
        success: false, 
        message: 'User not found for this token' 
      });
    }
    
    console.log('User authenticated:', user.email);
    // Set user in req
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: `Authentication failed: ${error.message}` 
    });
  }
};

// Check if student is accessing their own data
exports.checkStudentOwnership = async (req, res, next) => {
  try {
    if (req.user.role === 'coordinator') {
      // Coordinators can access any student data
      return next();
    }

    // For students, check if they're accessing their own data
    if (req.params.studentId && req.params.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access other student data',
      });
    }

    // For internship data, check if the internship belongs to the student
    if (req.params.internshipId) {
      const Internship = require('../models/Internship');
      const internship = await Internship.findById(req.params.internshipId);

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: 'Internship not found',
        });
      }

      if (internship.student.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this internship data',
        });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
