const { google } = require('googleapis');
require('dotenv').config();

// Google Drive API configuration
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/drive']
});

// Create Google Drive client
const drive = google.drive({
  version: 'v3',
  auth
});

// Root folder ID for InternTrack app
// REPLACE THIS WITH YOUR DRIVE FOLDER ID
const INTERNTRACK_ROOT_FOLDER = process.env.DRIVE_ROOT_FOLDER_ID || '1UKgsbo8fsiudV4FyK65R7spESa0n85Ib';

module.exports = {
  drive,
  INTERNTRACK_ROOT_FOLDER
};