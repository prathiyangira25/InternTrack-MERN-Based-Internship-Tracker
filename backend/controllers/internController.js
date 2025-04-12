const Internship = require('../models/Internship');
const User = require('../models/User');

// Helper to calculate duration in days
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInMs = end - start;
  return Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
};

// @desc    Create new internship record
// @route   POST /api/internships
// @access  Private (Student)
exports.createInternship = async (req, res, next) => {
  try {
    // Add student ID to request body
    req.body.student = req.user.id;
    
    // Calculate duration from start and end dates
    if (req.body.internshipStartDate && req.body.internshipEndDate) {
      req.body.duration = calculateDuration(
        req.body.internshipStartDate, 
        req.body.internshipEndDate
      );
    }
    
    // Create internship record
    const internship = await Internship.create(req.body);
    
    res.status(201).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error creating internship record:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all internships (for coordinator) or student's internships (for student)
// @route   GET /api/internships
// @access  Private
exports.getInternships = async (req, res, next) => {
  try {
    let query = {};
    
    // For students, only show their own internships
    if (req.user.role === 'student') {
      query.student = req.user.id;
    }
    
    // Apply filters if provided
    const { batch, companyName, academicYear, internshipType, obtainedThroughCDC, internshipLocation, verified } = req.query;
    
    if (batch) query.batch = batch;
    if (companyName) query.companyName = { $regex: companyName, $options: 'i' }; // Case-insensitive search
    if (academicYear) query.academicYear = academicYear;
    if (internshipType) query.internshipType = internshipType;
    if (obtainedThroughCDC) query.obtainedThroughCDC = obtainedThroughCDC === 'true';
    if (internshipLocation) query.internshipLocation = internshipLocation;
    if (verified) query.verified = verified === 'true';
    
    // For stipend filter
    if (req.query.minStipend) {
      query.stipend = { $gte: parseInt(req.query.minStipend) };
    }
    
    // Find internships and populate student info
    const internships = await Internship.find(query)
      .populate({
        path: 'student',
        select: 'name email registrationNumber batch mobileNumber'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Private
exports.getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate({
        path: 'student',
        select: 'name email registrationNumber batch mobileNumber'
      });
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    // For students, check if they are accessing their own internship
    if (req.user.role === 'student' && internship.student._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this internship'
      });
    }
    
    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private
exports.updateInternship = async (req, res, next) => {
  try {
    let internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    // For students, check if they are updating their own internship
    if (req.user.role === 'student' && internship.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this internship'
      });
    }
    
    // If dates are being updated, recalculate duration
    if (req.body.internshipStartDate && req.body.internshipEndDate) {
      req.body.duration = calculateDuration(
        req.body.internshipStartDate, 
        req.body.internshipEndDate
      );
    }
    
    // Update internship
    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Verify internship (coordinator only)
// @route   PUT /api/internships/:id/verify
// @access  Private (Coordinator)
exports.verifyInternship = async (req, res, next) => {
  try {
    let internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    // Update verification fields
    const updateData = {
      verified: true,
      verifiedBy: req.user.id,
      verificationDate: Date.now(),
      verificationComments: req.body.comments || 'Verified'
    };
    
    // Update internship
    internship = await Internship.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate({
      path: 'student',
      select: 'name email registrationNumber batch mobileNumber'
    });
    
    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error verifying internship:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Student can delete own, Coordinator can delete any)
exports.deleteInternship = async (req, res, next) => {
  try {
    console.log(`Attempting to delete internship ${req.params.id} by user ${req.user.id}`);
    
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      console.log(`Internship ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    // For students, check if they are deleting their own internship
    if (req.user.role === 'student' && internship.student.toString() !== req.user.id) {
      console.log(`User ${req.user.id} not authorized to delete internship ${req.params.id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this internship'
      });
    }
    
    // Use findByIdAndDelete instead of remove() which is deprecated
    await Internship.findByIdAndDelete(req.params.id);
    
    console.log(`Internship ${req.params.id} deleted successfully`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get statistics for coordinator dashboard
// @route   GET /api/internships/stats
// @access  Private (Coordinator)
exports.getInternshipStats = async (req, res, next) => {
  try {
    // Total internships
    const totalInternships = await Internship.countDocuments();
    
    // Internships by type
    const academicInternships = await Internship.countDocuments({ internshipType: 'Academic' });
    const industryInternships = await Internship.countDocuments({ internshipType: 'Industry' });
    
    // Internships by source
    const cdcInternships = await Internship.countDocuments({ obtainedThroughCDC: true });
    const nonCdcInternships = await Internship.countDocuments({ obtainedThroughCDC: false });
    
    // Internships by location
    const indiaInternships = await Internship.countDocuments({ internshipLocation: 'India' });
    const abroadInternships = await Internship.countDocuments({ internshipLocation: 'Abroad' });
    
    // Internships by verification status
    const verifiedInternships = await Internship.countDocuments({ verified: true });
    const unverifiedInternships = await Internship.countDocuments({ verified: false });
    
    // Internships by batch (top 5)
    const internshipsByBatch = await Internship.aggregate([
      { $group: { _id: '$batch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Internships by company (top 10)
    const internshipsByCompany = await Internship.aggregate([
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Average stipend
    const stipendStats = await Internship.aggregate([
      { $group: { _id: null, avgStipend: { $avg: '$stipend' }, maxStipend: { $max: '$stipend' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalInternships,
        byType: {
          academic: academicInternships,
          industry: industryInternships
        },
        bySource: {
          cdc: cdcInternships,
          nonCdc: nonCdcInternships
        },
        byLocation: {
          india: indiaInternships,
          abroad: abroadInternships
        },
        byVerification: {
          verified: verifiedInternships,
          unverified: unverifiedInternships
        },
        byBatch: internshipsByBatch,
        byCompany: internshipsByCompany,
        stipendStats: stipendStats[0] || { avgStipend: 0, maxStipend: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching internship stats:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};