const router = require('express').Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Secret key for JWT (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'training_tracker_jwt_secret_key_2026';

// Register new admin (first time setup)
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new admin
    const admin = new Admin({ username, password, email });
    await admin.save();

    res.status(201).json({ message: '✅ Admin account created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    if (!admin.verifyPassword(password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      admin: { 
        id: admin._id, 
        username: admin.username, 
        email: admin.email, 
        role: admin.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token (middleware)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get current admin info
router.get('/me', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, verifyToken };
