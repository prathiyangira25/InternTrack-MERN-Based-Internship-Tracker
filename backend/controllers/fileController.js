const { 
    createInternshipFolderStructure, 
    uploadInternshipFile 
  } = require('../utils/driveHelper');
  
  // @desc    Upload offer letter and store in Google Drive
  // @route   POST /api/files/upload/offerLetter
  // @access  Private (Student)
  exports.uploadOfferLetter = async (req, res, next) => {
    try {
      const { registrationNumber, batch, name } = req.body;
      
      // Create folder structure for student
      const studentFolderId = await createInternshipFolderStructure(
        batch, 
        registrationNumber, 
        name
      );
      
      // Upload file with standardized naming
      const fileDetails = await uploadInternshipFile(
        req.file.buffer,
        'offerLetter',
        registrationNumber,
        req.file.mimetype,
        studentFolderId,
        req.file.originalname
      );
      
      res.status(200).json({
        success: true,
        fileDetails: {
          fileId: fileDetails.id,
          fileName: fileDetails.name,
          webViewLink: fileDetails.webViewLink
        }
      });
    } catch (error) {
      console.error('Error uploading offer letter:', error);
      res.status(500).json({ 
        success: false, 
        message: `Error uploading offer letter: ${error.message}` 
      });
    }
  };
  
  // @desc    Upload permission letter and store in Google Drive
  // @route   POST /api/files/upload/permissionLetter
  // @access  Private (Student)
  exports.uploadPermissionLetter = async (req, res, next) => {
    try {
      const { registrationNumber, batch, name } = req.body;
      
      // Create folder structure for student
      const studentFolderId = await createInternshipFolderStructure(
        batch, 
        registrationNumber, 
        name
      );
      
      // Upload file with standardized naming
      const fileDetails = await uploadInternshipFile(
        req.file.buffer,
        'permissionLetter',
        registrationNumber,
        req.file.mimetype,
        studentFolderId,
        req.file.originalname
      );
      
      res.status(200).json({
        success: true,
        fileDetails: {
          fileId: fileDetails.id,
          fileName: fileDetails.name,
          webViewLink: fileDetails.webViewLink
        }
      });
    } catch (error) {
      console.error('Error uploading permission letter:', error);
      res.status(500).json({ 
        success: false, 
        message: `Error uploading permission letter: ${error.message}` 
      });
    }
  };
  
  // @desc    Upload completion certificate and store in Google Drive
  // @route   POST /api/files/upload/completionCertificate
  // @access  Private (Student)
  exports.uploadCompletionCertificate = async (req, res, next) => {
    try {
      const { registrationNumber, batch, name } = req.body;
      
      // Create folder structure for student
      const studentFolderId = await createInternshipFolderStructure(
        batch, 
        registrationNumber, 
        name
      );
      
      // Upload file with standardized naming
      const fileDetails = await uploadInternshipFile(
        req.file.buffer,
        'completionCertificate',
        registrationNumber,
        req.file.mimetype,
        studentFolderId,
        req.file.originalname
      );
      
      res.status(200).json({
        success: true,
        fileDetails: {
          fileId: fileDetails.id,
          fileName: fileDetails.name,
          webViewLink: fileDetails.webViewLink
        }
      });
    } catch (error) {
      console.error('Error uploading completion certificate:', error);
      res.status(500).json({ 
        success: false, 
        message: `Error uploading completion certificate: ${error.message}` 
      });
    }
  };