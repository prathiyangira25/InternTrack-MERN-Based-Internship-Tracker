const express = require('express');
const { 
  createInternship,
  getInternships,
  getInternship,
  updateInternship,
  verifyInternship,
  deleteInternship,
  getInternshipStats
} = require('../controllers/internController');
const { protect, authorize, checkStudentOwnership } = require('../middleware/auth');

const router = express.Router();

// Routes accessible by both students and coordinators
router.get('/', protect, getInternships);
router.get('/:id', protect, checkStudentOwnership, getInternship);

// Routes for students only
router.post('/', protect, authorize('student'), createInternship);
router.put('/:id', protect, authorize('student'), checkStudentOwnership, updateInternship);
router.delete('/:id', protect, checkStudentOwnership, deleteInternship);

// Routes for coordinators only
router.put('/:id/verify', protect, authorize('coordinator'), verifyInternship);
router.get('/stats/dashboard', protect, authorize('coordinator'), getInternshipStats);

module.exports = router;