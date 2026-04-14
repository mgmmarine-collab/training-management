const mongoose = require('mongoose');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  email: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  // Google OAuth credentials
  googleAccessToken: String,
  googleRefreshToken: String,
  googleDriveFolderId: String,
});

// Hash password before saving
adminSchema.pre('save', function() {
  if (!this.isModified('password')) return;
  
  const hash = crypto.createHmac('sha256', 'training_tracker_secret_key')
    .update(this.password)
    .digest('hex');
  
  this.password = hash;
});

// Method to verify password
adminSchema.methods.verifyPassword = function(password) {
  const hash = crypto.createHmac('sha256', 'training_tracker_secret_key')
    .update(password)
    .digest('hex');
  return this.password === hash;
};

module.exports = mongoose.model('Admin', adminSchema);
