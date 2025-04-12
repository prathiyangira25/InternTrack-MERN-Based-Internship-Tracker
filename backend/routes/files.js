const express = require('express');
const { 
  uploadOfferLetter, 
  uploadPermissionLetter, 
  uploadCompletionCertificate 
} = require('../controllers/fileController');
const { protect, authorize } = require('../middleware/auth');
const { upload, verifyPDFDetails } = require('../middleware/fileVerify');

const router = express.Router();

// All routes are protected and can only be accessed by students
router.post(
  '/upload/offerLetter',
  protect,
  authorize('student'),
  upload.single('file'),
  verifyPDFDetails,
  uploadOfferLetter
);

router.post(
  '/upload/permissionLetter',
  protect,
  authorize('student'),
  upload.single('file'),
  verifyPDFDetails,
  uploadPermissionLetter
);

router.post(
  '/upload/completionCertificate',
  protect,
  authorize('student'),
  upload.single('file'),
  verifyPDFDetails,
  uploadCompletionCertificate
);

module.exports = router;