const router = require('express').Router();
const { getAuthUrl, getTokens, initializeOAuth2, getUploadFolderId } = require('../utils/googleDriveOAuth');
const Admin = require('../models/Admin');
const { verifyToken } = require('./authRoutes');

// Get OAuth authorization URL
router.get('/oauth-url', verifyToken, (req, res) => {
  try {
    initializeOAuth2();
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth callback handler (Google redirects here with authorization code)
router.get('/oauth-callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).send('Authorization code not provided');
    }

    // Exchange code for tokens
    const tokens = await getTokens(code);

    // Store tokens in database
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).send('Admin not found');
    }

    admin.googleAccessToken = tokens.access_token;
    if (tokens.refresh_token) {
      admin.googleRefreshToken = tokens.refresh_token;
    }
    await admin.save();

    // Redirect to frontend with success - frontend will prompt for folder ID
    const redirectUrl = `http://localhost:3000/admin?auth=success`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send(`OAuth error: ${error.message}`);
  }
});

// Set Google Drive folder ID (after OAuth authorization)
router.post('/set-folder-id', verifyToken, async (req, res) => {
  try {
    const { folderId } = req.body;

    if (!folderId) {
      return res.status(400).json({ error: 'Folder ID required' });
    }

    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    if (!admin.googleAccessToken) {
      return res.status(400).json({ error: 'Please authorize Google Drive first' });
    }

    admin.googleDriveFolderId = folderId;
    await admin.save();

    res.json({
      message: '✅ Google Drive folder configured successfully',
      folderId: folderId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if Google Drive is authorized
router.get('/oauth-status', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findOne();
    const isAuthorized = !!(admin?.googleAccessToken);
    const isFolderConfigured = !!(admin?.googleDriveFolderId);

    res.json({
      isAuthorized,
      isFolderConfigured,
      folderId: admin?.googleDriveFolderId || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
