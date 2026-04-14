const router = require('express').Router();
const multer = require('multer');
const Candidate = require('../models/Candidate');
const { verifyToken } = require('./authRoutes');
const { uploadFileToDriveOAuth, deleteFileFromDriveOAuth, createDriveFolderOAuth, getUploadFolderId } = require('../utils/googleDriveOAuth');

// Configure multer to store files in memory (not disk)
const storage = multer.memoryStorage();

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/photoshop',
    'image/vnd.adobe.photoshop'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload placement files (offer letter, pay slip, certificate, etc.)
router.post('/upload-placement/:candidateId', verifyToken, upload.array('files', 5), async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { fileType } = req.body; // 'offer_letter', 'pay_slip', 'certificate'

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Get the root upload folder
    let rootFolderId;
    try {
      rootFolderId = await getUploadFolderId();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Google Drive not configured. Please authorize and set folder ID first.',
        setupUrl: '/api/oauth/oauth-url'
      });
    }

    // Create candidate folder if it doesn't exist
    let candidateFolderId = candidate.googleDriveFolderId;
    if (!candidateFolderId) {
      try {
        candidateFolderId = await createDriveFolderOAuth(
          `Candidate_${candidateId}_${candidate.name}`,
          rootFolderId
        );
        candidate.googleDriveFolderId = candidateFolderId;
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create folder: ' + error.message });
      }
    }

    // Upload each file to Google Drive
    const uploadedFiles = [];
    for (const file of req.files) {
      try {
        const driveFile = await uploadFileToDriveOAuth(
          file.buffer,
          file.originalname,
          file.mimetype,
          candidateFolderId
        );

        uploadedFiles.push({
          fileId: driveFile.fileId,
          fileName: driveFile.fileName,
          fileType: fileType || 'placement',
          viewLink: driveFile.viewLink,
          downloadLink: driveFile.downloadLink,
          fileSize: driveFile.size,
          mimeType: driveFile.mimeType,
          uploadedDate: driveFile.uploadedDate
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'Failed to upload files' });
    }

    // Add files to placement files array
    candidate.placementFiles.push(...uploadedFiles);
    candidate.isPlaced = true;
    await candidate.save();

    res.json({
      message: '✅ Files uploaded to Google Drive successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload certificate files
router.post('/upload-certificate/:candidateId', verifyToken, upload.array('files', 5), async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Get the root upload folder
    let rootFolderId;
    try {
      rootFolderId = await getUploadFolderId();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Google Drive not configured. Please authorize and set folder ID first.',
        setupUrl: '/api/oauth/oauth-url'
      });
    }

    // Create candidate folder if it doesn't exist
    let candidateFolderId = candidate.googleDriveFolderId;
    if (!candidateFolderId) {
      try {
        candidateFolderId = await createDriveFolderOAuth(
          `Candidate_${candidateId}_${candidate.name}`,
          rootFolderId
        );
        candidate.googleDriveFolderId = candidateFolderId;
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create folder: ' + error.message });
      }
    }

    // Upload each file to Google Drive
    const uploadedFiles = [];
    for (const file of req.files) {
      try {
        const driveFile = await uploadFileToDriveOAuth(
          file.buffer,
          file.originalname,
          file.mimetype,
          candidateFolderId
        );

        uploadedFiles.push({
          fileId: driveFile.fileId,
          fileName: driveFile.fileName,
          fileType: 'certificate',
          viewLink: driveFile.viewLink,
          downloadLink: driveFile.downloadLink,
          fileSize: driveFile.size,
          mimeType: driveFile.mimeType,
          uploadedDate: driveFile.uploadedDate
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'Failed to upload files' });
    }

    // Add files to certificate files array
    candidate.certificateFiles.push(...uploadedFiles);
    candidate.certificateStatus = 'issued';
    await candidate.save();

    res.json({
      message: '✅ Certificate files uploaded to Google Drive successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get placement files for a candidate
router.get('/placement-files/:candidateId', verifyToken, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate.placementFiles || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get certificate files for a candidate
router.get('/certificate-files/:candidateId', verifyToken, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate.certificateFiles || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a file
router.delete('/file/:candidateId/:fileIndex', verifyToken, async (req, res) => {
  try {
    const { candidateId, fileIndex } = req.params;
    const { fileType } = req.body; // 'placement' or 'certificate'

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (fileType === 'placement' && candidate.placementFiles[fileIndex]) {
      // Delete file from Google Drive
      try {
        await deleteFileFromDriveOAuth(candidate.placementFiles[fileIndex].fileId);
      } catch (error) {
        console.error('Error deleting from Drive:', error);
      }
      candidate.placementFiles.splice(fileIndex, 1);
    } else if (fileType === 'certificate' && candidate.certificateFiles[fileIndex]) {
      // Delete file from Google Drive
      try {
        await deleteFileFromDriveOAuth(candidate.certificateFiles[fileIndex].fileId);
      } catch (error) {
        console.error('Error deleting from Drive:', error);
      }
      candidate.certificateFiles.splice(fileIndex, 1);
    }

    await candidate.save();
    res.json({ message: '✅ File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
