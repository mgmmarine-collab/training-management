const { google } = require('googleapis');
const { Readable } = require('stream');
const path = require('path');

// Initialize Google Drive API
let drive;

async function initializeDrive() {
  try {
    // Check if using OAuth2 or Service Account
    const credentialsJson = process.env.GOOGLE_CREDENTIALS;
    
    if (!credentialsJson) {
      console.warn('⚠️ GOOGLE_CREDENTIALS not found in environment variables');
      return null;
    }

    const credentials = JSON.parse(credentialsJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    drive = google.drive({ version: 'v3', auth });
    console.log('✅ Google Drive API initialized');
    return drive;
  } catch (error) {
    console.error('❌ Error initializing Google Drive:', error.message);
    return null;
  }
}

// Upload file to Google Drive
async function uploadFileToDrive(fileBuffer, fileName, mimeType, folderId = null) {
  try {
    if (!drive) {
      drive = await initializeDrive();
      if (!drive) throw new Error('Google Drive not initialized');
    }

    // Use environment folder ID if not specified
    const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileMetadata = {
      name: fileName,
      ...(targetFolderId && { parents: [targetFolderId] })
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(fileBuffer)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, size, mimeType, createdTime',
      supportsAllDrives: true
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

// Create folder in Google Drive
async function createDriveFolder(folderName, parentFolderId = null) {
  try {
    if (!drive) {
      drive = await initializeDrive();
      if (!drive) throw new Error('Google Drive not initialized');
    }

    // Use environment folder ID as parent if not specified
    const parentId = parentFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] })
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name',
      supportsAllDrives: true
    });

    return response.data.id;
  } catch (error) {
    console.error('❌ Error creating Drive folder:', error.message);
    throw error;
  }
}

// Get file download URL
function getDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Delete file from Google Drive
async function deleteFileFromDrive(fileId) {
  try {
    if (!drive) {
      drive = await initializeDrive();
      if (!drive) throw new Error('Google Drive not initialized');
    }

    await drive.files.delete({
      fileId: fileId,
      supportsAllDrives: true
    });

    return true;
  } catch (error) {
    console.error('❌ Error deleting from Google Drive:', error.message);
    throw error;
  }
}

// List files in a Drive folder
async function listFilesInFolder(folderId) {
  try {
    if (!drive) {
      drive = await initializeDrive();
      if (!drive) throw new Error('Google Drive not initialized');
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType, size, createdTime, webViewLink)',
      supportsAllDrives: true
    });

    return response.data.files || [];
  } catch (error) {
    console.error('❌ Error listing Drive files:', error.message);
    throw error;
  }
}

module.exports = {
  initializeDrive,
  uploadFileToDrive,
  createDriveFolder,
  getDownloadUrl,
  deleteFileFromDrive,
  listFilesInFolder
};
