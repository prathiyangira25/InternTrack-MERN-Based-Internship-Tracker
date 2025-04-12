const { drive, INTERNTRACK_ROOT_FOLDER } = require('../config/drive');
const stream = require('stream');

/**
 * Create a folder in Google Drive
 * @param {string} folderName - Name of the folder to create
 * @param {string} parentFolderId - ID of the parent folder
 * @returns {Promise<string>} - ID of the created folder
 */
const createFolder = async (folderName, parentFolderId) => {
  try {
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId || INTERNTRACK_ROOT_FOLDER]
    };

    const response = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });

    return response.data.id;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error(`Failed to create folder: ${error.message}`);
  }
};

/**
 * Check if a folder exists and return its ID if it does
 * @param {string} folderName - Name of the folder to check
 * @param {string} parentFolderId - ID of the parent folder
 * @returns {Promise<string|null>} - ID of the folder if it exists, null otherwise
 */
const findFolder = async (folderName, parentFolderId) => {
  try {
    const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId || INTERNTRACK_ROOT_FOLDER}' in parents and trashed=false`;
    
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.data.files.length > 0) {
      return response.data.files[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding folder:', error);
    throw new Error(`Failed to find folder: ${error.message}`);
  }
};

/**
 * Get or create a folder in Google Drive
 * @param {string} folderName - Name of the folder to get or create
 * @param {string} parentFolderId - ID of the parent folder
 * @returns {Promise<string>} - ID of the folder
 */
const getOrCreateFolder = async (folderName, parentFolderId) => {
  const existingFolderId = await findFolder(folderName, parentFolderId);
  
  if (existingFolderId) {
    return existingFolderId;
  }
  
  return await createFolder(folderName, parentFolderId);
};

/**
 * Create folder structure for internship files
 * @param {string} batch - Student batch (e.g., "2022-26")
 * @param {string} registrationNumber - Student registration number
 * @param {string} studentName - Student name
 * @returns {Promise<string>} - ID of the student's folder
 */
const createInternshipFolderStructure = async (batch, registrationNumber, studentName) => {
  try {
    // Extract the batch start year (e.g., "2022-26" -> "2022")
    const batchYear = batch.split('-')[0];

    // Step 1: Create/get the Year folder inside InternTrack
    const academicYearFolderId = await getOrCreateFolder(batchYear, INTERNTRACK_ROOT_FOLDER);

    // Step 2: Create/get the "details" folder inside the Year folder
    const detailsFolderId = await getOrCreateFolder("details", academicYearFolderId);

    // Step 3: Create/get the student folder inside "details"
    const studentFolderName = `${registrationNumber}_${studentName.replace(/\s+/g, '_')}`;
    const studentFolderId = await getOrCreateFolder(studentFolderName, detailsFolderId);

    return studentFolderId;
  } catch (error) {
    console.error('Error creating folder structure:', error);
    throw new Error(`Failed to create folder structure: ${error.message}`);
  }
};

/**
 * Upload a file to Google Drive
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Name to save the file as
 * @param {string} mimeType - MIME type of the file
 * @param {string} folderId - ID of the folder to upload to
 * @returns {Promise<Object>} - File metadata
 */
const uploadFile = async (fileBuffer, fileName, mimeType, folderId) => {
  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };
    
    const media = {
      mimeType,
      body: bufferStream
    };
    
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload internship file with proper naming
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileType - Type of file (offerLetter, permissionLetter, completionCertificate)
 * @param {string} registrationNumber - Student registration number
 * @param {string} mimeType - MIME type of the file
 * @param {string} folderId - ID of the student's folder
 * @param {string} originalFileName - Original file name (for extension)
 * @returns {Promise<Object>} - File metadata
 */
const uploadInternshipFile = async (fileBuffer, fileType, registrationNumber, mimeType, folderId, originalFileName) => {
  try {
    // Get file extension from original file name
    const fileExtension = originalFileName.split('.').pop().toLowerCase();
    
    // Generate file name based on type and registration number
    const fileName = `${fileType}_${registrationNumber}.${fileExtension}`;
    
    // Upload the file
    return await uploadFile(fileBuffer, fileName, mimeType, folderId);
  } catch (error) {
    console.error('Error uploading internship file:', error);
    throw new Error(`Failed to upload internship file: ${error.message}`);
  }
};

module.exports = {
  getOrCreateFolder,
  createInternshipFolderStructure,
  uploadFile,
  uploadInternshipFile
};