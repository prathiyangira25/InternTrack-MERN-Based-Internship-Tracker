const multer = require('multer');
const { verifyPDFContent } = require('../utils/pdfExtractor');

// Configure multer storage to store files in memory
const storage = multer.memoryStorage();

// Filter for PDF files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Set up multer upload
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Middleware to verify PDF content
const verifyPDFDetails = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a PDF file' 
      });
    }

    // Student info from the request body
    const studentInfo = {
      name: req.body.name,
      registrationNumber: req.body.registrationNumber
    };

    // Verify that the PDF contains student name and registration number
    const isValid = await verifyPDFContent(req.file.buffer, studentInfo);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded PDF does not contain the student name and registration number. Please verify the document and try again.'
      });
    }

    next();
  } catch (error) {
    console.error('Error verifying PDF:', error);
    res.status(500).json({ 
      success: false, 
      message: `Error verifying PDF: ${error.message}` 
    });
  }
};

module.exports = {
  upload,
  verifyPDFDetails
};