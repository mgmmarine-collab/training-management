const { google } = require('googleapis');
const { Readable } = require('stream');
const path = require('path');
const Admin = require('../models/Admin');

// OAuth2 client
let oauth2Client;

// Initialize OAuth2
function initializeOAuth2() {
  oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  return oauth2Client;
}

// Get authorization URL
function getAuthUrl() {
  if (!oauth2Client) initializeOAuth2();
  
  const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}

// Exchange code for tokens
async function getTokens(code) {
  if (!oauth2Client) initializeOAuth2();
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    throw new Error('Failed to get tokens: ' + error.message);
  }
}

// Upload file to Google Drive using OAuth token
async function uploadFileToDriveOAuth(fileBuffer, fileName, mimeType, folderId) {
  try {
    // Get the stored OAuth token
    const admin = await Admin.findOne();
    if (!admin || !admin.googleAccessToken) {
      throw new Error('Google OAuth not authorized. Please authorize the app first.');
    }

    if (!oauth2Client) initializeOAuth2();
    
    oauth2Client.setCredentials({
      access_token: admin.googleAccessToken,
      refresh_token: admin.googleRefreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(fileBuffer)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, size, mimeType, createdTime'
    });

    return {
      fileId: response.data.id,
      fileName: response.data.name,
      viewLink: response.data.webViewLink,
      downloadLink: response.data.webContentLink,
      size: response.data.size,
      mimeType: response.data.mimeType,
      uploadedDate: response.data.createdTime
    };
  } catch (error) {
    console.error('❌ Error uploading to Google Drive:', error.message);
    throw error;
  }
}

// Create folder in Google Drive using OAuth token
async function createDriveFolderOAuth(folderName, parentFolderId) {
  try {
    const admin = await Admin.findOne();
    if (!admin || !admin.googleAccessToken) {
      throw new Error('Google OAuth not authorized. Please authorize the app first.');
    }

    if (!parentFolderId) {
      throw new Error('Parent folder ID is required');
    }

    if (!oauth2Client) initializeOAuth2();
    
    oauth2Client.setCredentials({
      access_token: admin.googleAccessToken,
      refresh_token: admin.googleRefreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name',
      supportsAllDrives: true
    });

    return response.data.id;
  } catch (error) {
    console.error('❌ Error creating Drive folder:', error.message);
    // Clear invalid folder ID if something went wrong
    if (error.message.includes('File not found') || error.message.includes('invalid')) {
      try {
        const admin = await Admin.findOne();
        if (admin) {
          admin.googleDriveFolderId = null;
          await admin.save();
        }
      } catch (e) {
        // Silently fail if we can't clear it
      }
    }
    throw error;
  }
}

// Delete file from Google Drive using OAuth token
async function deleteFileFromDriveOAuth(fileId) {
  try {
    const admin = await Admin.findOne();
    if (!admin || !admin.googleAccessToken) {
      throw new Error('Google OAuth not authorized.');
    }

    if (!oauth2Client) initializeOAuth2();
    
    oauth2Client.setCredentials({
      access_token: admin.googleAccessToken,
      refresh_token: admin.googleRefreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    await drive.files.delete({
      fileId: fileId
    });

    return true;
  } catch (error) {
    console.error('❌ Error deleting from Google Drive:', error.message);
    throw error;
  }
}

// Get root folder ID for uploads
async function getUploadFolderId() {
  try {
    const admin = await Admin.findOne();
    
    if (!admin?.googleDriveFolderId) {
      throw new Error('Google Drive folder not configured');
    }

    // Validate folder ID format (should be just an ID, not a URL)
    const folderId = String(admin.googleDriveFolderId).trim();
    if (folderId.includes('google.com') || folderId.includes('/') || folderId.includes('http')) {
      // Invalid folder ID - clear it from database
      admin.googleDriveFolderId = null;
      await admin.save();
      throw new Error('Invalid Google Drive folder ID. Please reconfigure.');
    }

    return folderId;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  initializeOAuth2,
  getAuthUrl,
  getTokens,
  uploadFileToDriveOAuth,
  createDriveFolderOAuth,
  deleteFileFromDriveOAuth,
  getUploadFolderId
};
