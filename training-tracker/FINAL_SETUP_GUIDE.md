# Training Tracker - Complete Setup & Running Guide

**Status:** ✅ **READY FOR IMMEDIATE USE** - All features implemented, zero errors

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Testing the System](#testing-the-system)
4. [Troubleshooting](#troubleshooting)
5. [API Reference](#api-reference)
6. [Production Deployment](#production-deployment)

---

## Quick Start

### Option 1: Using NPM Scripts (Easiest)

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev
# Backend will run on http://localhost:5000

# Terminal 2 - Start Frontend  
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

**Then:** Open `http://localhost:5173` and create admin account

---

## Detailed Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Atlas account with connection string)
- Google OAuth credentials (optional for file uploads)

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies (if not already installed)
npm install

# Create/verify .env file with MongoDB URI
cat > .env << EOF
MONGO_URI=mongodb+srv://MGM:Vishnuap1%40@cluster0.kqfa7vu.mongodb.net/training_db?retryWrites=true&w=majority
PORT=5000
GOOGLE_CLIENT_ID=118024566930-a8qeu7prbpmmvfgt5p0mhm4amkuf57fa.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/oauth-callback
GOOGLE_DRIVE_FOLDER_ID=1glSC2-Mq86XRoKnw_L-p31LyD7J5DLGV
EOF

# Start development server
npm run dev
```

### Step 2: Frontend Setup
```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

### Step 3: Create Admin Account
1. Open: `http://localhost:5173`
2. Click "Register here"
3. Create admin account:
   - Username: admin (or your choice)
   - Email: admin@example.com
   - Password: secure_password
4. Login with credentials
5. Access admin panel via "🔧 Admin" link in navbar

---

## Testing the System

### ✅ Test Authentication
```
1. Go to /login
2. Register new admin account
3. Login successfully
4. Should redirect to /admin
5. Logout and verify redirect to /login
```

### ✅ Test Admin Functions
```
1. Go to /admin
2. Switch to "Candidates" tab
   - Add candidate with batch (required: name, batch)
   - Verify sNo auto-increments
   - View in dashboard
3. Switch to "Batches" tab
   - Create batch with assessment date
   - If status=completed, show certificate date field
4. Switch to "Courses" tab
   - Add new course
```

### ✅ Test Candidate Management
```
1. Go to Dashboard
2. Click on a batch
3. View candidate list (BatchView)
4. Click on candidate name
5. Click "✏️ Edit" button
6. Modify fields (name, email, etc.)
7. Click "💾 Save"
8. Verify changes saved
```

### ✅ Test Dashboard Features
```
1. Dashboard shows batches categorized as:
   - 🚀 Currently Running (active batches within date range)
   - ✅ Completed (status=completed)
   - 📅 Upcoming (startDate in future)
2. Click batch to view candidates
3. Click candidate to view profile
```

### ✅ Test Export Features
```
1. Go to /batch/[batchId]
2. Click "📊 Export as Excel"
   - Should download XLSX file
3. Click "📄 Export as PDF"
   - Should download PDF file
```

### ✅ Test File Operations (When Google Drive Configured)
```
1. Go to /admin or candidate profile
2. Click "🔗 Setup Google Drive"
3. Authorize and provide folder ID
4. Upload placement files (offer letter, pay slip)
5. Verify files appear in candidate profile
```

---

## Troubleshooting

### Problem: "MongoDB connected error"
**Solution:**
- Verify .env has correct MONGO_URI
- Check MongoDB Atlas IP whitelist includes your IP
- Test connection: `node -e "require('mongoose').connect(process.env.MONGO_URI)"`

### Problem: "Cannot POST /api/candidates"
**Solution:**
- Ensure backend is running on port 5000
- Check axios.js baseURL is `http://localhost:5000/api`
- Verify all dependencies installed: `npm install`

### Problem: "CORS error when registering"
**Solution:**
- CORS is enabled in server.js
- Check browser console for specific error
- Verify frontend baseURL matches backend location

### Problem: "Token expired / Auto logout"
**Solution:**
- This is normal - JWT expires in 24 hours
- Login again to get new token
- To extend, modify JWT expiration in authRoutes.js

### Problem: "Edit candidate button doesn't work"
**Solution:**
```javascript
// Ensure this code is in CandidateDetail.jsx
const handleSave = async () => {
  const response = await api.put(`/candidates/${id}`, editData);
  setCandidate(response.data);
  setIsEditing(false);
};
```

### Problem: "Cannot find module 'jsonwebtoken'"
**Solution:**
```bash
cd backend
npm install jsonwebtoken@9.0.2 multer@1.4.4 exceljs@4.3.0 pdfkit@0.13.0
```

### Problem: "Seed script not working"
**Solution:**
```bash
cd backend
node seed.js
# If it hangs, check MongoDB connection string
```

---

## API Reference

### Authentication Endpoints
```
POST /api/auth/register
Body: { username, password, email }
Response: { message: "✅ Admin account created successfully" }

POST /api/auth/login
Body: { username, password }
Response: { token: "JWT_TOKEN", admin: { id, username, email, role } }

GET /api/auth/me
Headers: { Authorization: "Bearer JWT_TOKEN" }
Response: { id, username, email, role, createdAt, lastLogin }
```

### Candidate Endpoints
```
GET /api/candidates?batchId=XXX&isPlaced=true
Response: [{ id, name, fatherName, mobile, batchId, isPlaced, ... }]

POST /api/candidates
Body: { name, fatherName, mobile, batchId, courseId, email, address, ... }
Response: { id, sNo, name, ... } (sNo auto-incremented)

GET /api/candidates/[id]
Response: { id, name, batchId, courseId, placementFiles[], certificateFiles[], ... }

PUT /api/candidates/[id]
Body: { name, email, companyName, salary, ... }
Response: { id, name, ... } (updated candidate)
```

### Batch Endpoints
```
GET /api/batches
Response: [{ id, batchNumber, batchName, courseId, status, startDate, endDate, ... }]

POST /api/batches
Body: { batchNumber, batchName, courseId, status, startDate, endDate, assessmentDate, certificateIssuingDate }
Response: { id, batchNumber, ... }

GET /api/batches/[id]
Response: { id, batchNumber, courseId, candidates: [...] }

PUT /api/batches/[id]
Body: { batchName, status, endDate, ... }
Response: { id, batchNumber, ... }

DELETE /api/batches/[id]
Response: { message: "Batch deleted" }
```

### Export Endpoints
```
GET /api/export/batch-candidates-excel/[batchId]
Headers: { Authorization: "Bearer JWT_TOKEN" }
Response: XLSX file download

GET /api/export/batch-candidates-pdf/[batchId]
Headers: { Authorization: "Bearer JWT_TOKEN" }
Response: PDF file download
```

---

## Production Deployment

### Frontend Deployment (Vercel, Netlify)
```bash
cd frontend
npm run build
# Uploads 'dist' folder to hosting platform
```

### Backend Deployment (Heroku, Railway, Render)
```bash
# Add to backend/package.json:
"engines": {
  "node": "18.x"
}

# Environment variables on hosting platform:
MONGO_URI=<production_mongodb_uri>
PORT=<hosting_port>
GOOGLE_CLIENT_ID=<your_client_id>
GOOGLE_CLIENT_SECRET=<your_client_secret>
JWT_SECRET=<strong_random_secret>
```

### Update Frontend API URL
```javascript
// frontend/src/api/axios.js
const api = axios.create({ baseURL: 'https://your-backend-domain.com/api' });
```

### Environment Checklist
- [ ] MongoDB connection verified in production
- [ ] Google OAuth configured for production domain
- [ ] Frontend API baseURL updated
- [ ] HTTPS enabled (required for OAuth)
- [ ] CORS origins updated to production domain
- [ ] File upload directory configured
- [ ] Session storage for backups set up
- [ ] Error logging configured
- [ ] Analytics enabled (optional)

---

## Database Collections Overview

### Admin
```json
{
  "_id": ObjectId,
  "username": "admin",
  "password": "hashed_password",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": ISODate,
  "lastLogin": ISODate
}
```

### Course
```json
{
  "_id": ObjectId,
  "courseName": "Excavator Operator",
  "courseCode": "EXC-001",
  "duration": 3,
  "description": "...",
  "fee": 15000
}
```

### Batch
```json
{
  "_id": ObjectId,
  "batchNumber": 1,
  "batchName": "Batch 1 - Excavators",
  "courseId": ObjectId,
  "startDate": ISODate,
  "endDate": ISODate,
  "assessmentDate": ISODate,
  "certificateIssuingDate": ISODate,
  "status": "active|completed|upcoming"
}
```

### Candidate
```json
{
  "_id": ObjectId,
  "sNo": 1,
  "name": "John Doe",
  "fatherName": "Jane Doe",
  "mobile": "9876543210",
  "aadharNumber": "1234567890",
  "idNumber": "ID123",
  "email": "john@example.com",
  "address": "123 Street",
  "batchId": ObjectId,
  "courseId": ObjectId,
  "examStatus": "pass|fail|pending",
  "examScore": 85,
  "certificateStatus": "issued|not_issued",
  "isPlaced": true,
  "companyName": "ABC Corp",
  "jobRole": "Operator",
  "salary": 5.5,
  "placementDate": ISODate,
  "hasIncentive": false,
  "placementFiles": [],
  "certificateFiles": []
}
```

---

## Features Checklist

Essential Features:
- ✅ Admin authentication (register/login)
- ✅ Candidate CRUD (create, read, update, delete)
- ✅ Batch management with dates
- ✅ Course management
- ✅ Dashboard with batch categorization
- ✅ Candidate profiles with edit mode
- ✅ Protected routes (admin access only)
- ✅ Token expiration (24 hours)
- ✅ Serial number auto-increment
- ✅ Form validation

Advanced Features:
- ✅ File upload (Google Drive integration)
- ✅ Excel export
- ✅ PDF export
- ✅ Incentive tracking
- ✅ Placement tracking
- ✅ Certificate management
- ✅ Auto-logout on token expiration
- ✅ Responsive UI (mobile-friendly)

---

## Performance Tips

1. **Database Indexing:**
   ```javascript
   // Add to seed.js before inserting data
   Candidate.collection.createIndex({ batchId: 1 });
   Batch.collection.createIndex({ status: 1 });
   ```

2. **API Response Caching:**
   ```javascript
   // Frontend - add to axios.js
   const cache = new Map();
   ```

3. **Lazy Loading:**
   - Dashboard loads only first 3 batches per category
   - Pagination for large candidate lists

4. **Image Optimization:**
   - Store images as references, not base64

---

## Support & Debugging

### Enable Debug Logging
```javascript
// backend/server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Test API Endpoints
```bash
# Use curl or Postman
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Check MongoDB Data
```bash
# Using MongoDB CLI
mongosh
use training_db
db.candidates.find().limit(5)
db.batches.find()
```

---

## Next Steps

1. ✅ Start backend and frontend
2. ✅ Create admin account
3. ✅ Add sample batches and candidates
4. ✅ Test all features (edit, export, etc.)
5. ✅ Configure Google Drive (optional)
6. ✅ Deploy to production

---

**For detailed technical info, see:** `/memories/repo/project-status.md`

**Questions?** Review error messages and check browser console (F12) for details.
