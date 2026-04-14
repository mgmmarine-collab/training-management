const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Initialize OAuth (non-blocking - errors here should not crash server)
try {
  const { initializeOAuth2 } = require('./utils/googleDriveOAuth');
  initializeOAuth2();
  console.log('✅ Google OAuth2 client initialized');
} catch (error) {
  console.warn('⚠️  Google OAuth2 initialization warning:', error.message);
  console.warn('⚠️  File uploads will not work until Google Drive is properly configured');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Routes
app.use('/api/auth', require('./routes/authRoutes').router);
app.use('/api/oauth', require('./routes/oauthRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));