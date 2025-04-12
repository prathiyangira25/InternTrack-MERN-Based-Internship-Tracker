const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadOfferLetter } = require('../controllers/fileController');

const router = express.Router();
router.post('/upload/offerLetter', protect, uploadOfferLetter);


// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;

router.post('/test-injection', (req, res) => {
    console.log('Received test data:', req.body);
    res.status(200).json({ 
      success: true, 
      message: 'Test completed', 
      sanitizedData: req.body 
    });
  });