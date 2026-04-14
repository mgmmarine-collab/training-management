# 🔐 Complete Advanced Features Guide

## Table of Contents
1. [Admin Authentication](#-admin-authentication)
2. [File Management System](#-file-management-system)
3. [Batch Details & Editing](#-batch-details--editing)
4. [Export Functionality](#-export-functionality)
5. [Installation & Setup](#-installation--setup)
6. [API Endpoints Reference](#-api-endpoints-reference)

---

## 🔐 Admin Authentication

### Overview
Secure admin panel with username/password protection using JWT tokens.

### Setup - First Time

**Step 1: Install Backend Dependencies**
```bash
cd backend
npm install
```

**Step 2: Create First Admin Account**
1. Start backend: `npm run dev`
2. Open frontend: `http://localhost:5173`
3. You'll see login page
4. Click "Register here"
5. Create admin account with username, email, password
6. Login with credentials

### Features
- ✅ JWT token-based authentication
- ✅ Token expires in 24 hours
- ✅ Automatic logout on token expiration
- ✅ Protected routes (Admin panel)
- ✅ Admin info stored in localStorage

### Login Flow

```
┌─────────────────────────────────────┐
│ User enters username & password      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ POST /api/auth/login                │
│ Returns: JWT token + admin info     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Token stored in localStorage        │
│ Included in all API requests        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Access admin panel                  │
│ Create batches, candidates, files   │
└─────────────────────────────────────┘
```

### API Endpoints - Auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new admin account |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current admin info |

---

## 📁 File Management System

### Overview
Store and manage:
- **Offer Letters** (PDF, Word, Image)
- **Pay Slips** (PDF, Word, Image)
- **Certificates** (PDF, Image, PSD, Word)
- Supports: PDF, JPEG, PNG, GIF, DOC, DOCX, PSD

### File Storage
Files stored at: `/backend/public/uploads/`

### Upload File for Placed Candidate

**API: POST `/api/files/upload-placement/:candidateId`**

```javascript
// Request
const formData = new FormData();
formData.append('files', offerLetterFile);
formData.append('files', paySlipFile);
formData.append('fileType', 'placement');

const response = await api.post(
  `/files/upload-placement/${candidateId}`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

### Upload Certificate

**API: POST `/api/files/upload-certificate/:candidateId`**

```javascript
// Request
const formData = new FormData();
formData.append('files', certificateFile);

const response = await api.post(
  `/files/upload-certificate/${candidateId}`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

### Get Placement Files

**API: GET `/api/files/placement-files/:candidateId`**

```javascript
const files = await api.get(`/files/placement-files/${candidateId}`);
// Returns: [{ fileName, filePath, uploadedDate, mimeType }, ...]
```

### Download File

```javascript
// Download file
const downloadFile = (filePath, fileName) => {
  const link = document.createElement('a');
  link.href = `http://localhost:5000${filePath}`;
  link.download = fileName;
  link.click();
};
```

### Supported File Types

| Type | Formats | Max Size |
|------|---------|----------|
| Offer Letter | PDF, DOC, DOCX, JPG, PNG | 50MB |
| Pay Slip | PDF, DOC, DOCX, JPG, PNG | 50MB |
| Certificate | PDF, JPG, PNG, PSD | 50MB |

### File Model Schema

```javascript
{
  fileName: "offer_letter.pdf",
  fileType: "offer_letter",  // or 'pay_slip', 'certificate'
  filePath: "/uploads/1234567890-987654321.pdf",
  uploadedDate: "2026-04-08T10:30:00Z",
  fileSize: 245632,  // bytes
  mimeType: "application/pdf"
}
```

---

## 📊 Batch Details & Editing

### Batch View Features

**Show:**
- ✅ Batch details (number, name, course, dates)
- ✅ Candidate list in editable table
- ✅ Edit candidate information inline
- ✅ Add new candidates to batch
- ✅ Remove candidates
- ✅ View candidate files

### Batch Edit/Update

**API: PUT `/api/batches/:batchId`**

```javascript
// Request
const updateData = {
  batchName: "Updated Name",
  status: "completed",
  assessmentDate: "2026-05-15",
  certificateIssuingDate: "2026-06-15"
};

const response = await api.put(`/batches/${batchId}`, updateData);
```

### Candidate Edit in Batch

**API: PUT `/api/candidates/:candidateId`**

```javascript
// Request
const updateData = {
  name: "Updated Name",
  fatherName: "Updated Father Name",
  mobile: "9876543210",
  examStatus: "pass",
  examScore: 85,
  certificateStatus: "issued",
  isPlaced: true,
  companyName: "Tech Corp",
  jobRole: "Developer",
  salary: 5.5
};

const response = await api.put(`/candidates/${candidateId}`, updateData);
```

### Candidate Table in Batch

Displays columns:
- S.No
- Name
- Father's Name
- Mobile
- Email
- Exam Status (pass/fail)
- Certificate (issued/not_issued)
- Placed (Yes/No)
- Actions (Edit, Delete, View Files)

---

## 🔄 Export Functionality

### Export Candidate List (Excel)

**API: GET `/api/export/batch-candidates-excel/:batchId`**

```javascript
const downloadCandidatesExcel = (batchId) => {
  const link = document.createElement('a');
  link.href = `http://localhost:5000/api/export/batch-candidates-excel/${batchId}`;
  link.download = `Batch_Candidates.xlsx`;
  link.click();
};
```

**Contains:** All candidate details, exam status, placement info

### Export Batch Details (Excel)

**API: GET `/api/export/batch-details-excel/:batchId`**

Contains multiple sheets:
1. **Batch Details** - Summary information
2. **Summary** - Overall statistics

### Export Candidates (PDF)

**API: GET `/api/export/batch-candidates-pdf/:batchId`**

```javascript
const downloadCandidatesPDF = (batchId) => {
  const link = document.createElement('a');
  link.href = `http://localhost:5000/api/export/batch-candidates-pdf/${batchId}`;
  link.download = `Batch_Candidates.pdf`;
  link.click();
};
```

### Excel Export Columns

| Column | Data |
|--------|------|
| S.No | Auto-incremented |
| Name | Candidate name |
| Father's Name | Father's name |
| Mobile | Contact number |
| Aadhar | Aadhar number |
| Email | Email address |
| Address | Full address |
| Exam Status | pass/fail/pending |
| Exam Score | Numeric score |
| Certificate | issued/not_issued |
| Placed | Yes/No |
| Company | Company name |
| Position | Job role |
| Salary | In LPA |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
echo "MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/training_db" > .env
echo "PORT=5000" >> .env
echo "JWT_SECRET=your_secret_key" >> .env

# 3. Create first admin account
npm run dev
# Then use frontend to register

# 4. Alternative: Direct MongoDB setup
# See MONGODB_SETUP.md for shell commands
```

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

### Create Upload Directory

Backend automatically creates `/backend/public/uploads/` on startup.

Manual creation (if needed):
```bash
mkdir -p backend/public/uploads
```

---

## 📡 API Endpoints Reference

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Batches
```
GET    /api/batches
GET    /api/batches/:id
POST   /api/batches
PUT    /api/batches/:id
DELETE /api/batches/:id
```

### Candidates
```
GET    /api/candidates
GET    /api/candidates/:id
POST   /api/candidates
PUT    /api/candidates/:id
DELETE /api/candidates/:id
```

### Files
```
POST   /api/files/upload-placement/:candidateId
POST   /api/files/upload-certificate/:candidateId
GET    /api/files/placement-files/:candidateId
GET    /api/files/certificate-files/:candidateId
DELETE /api/files/file/:candidateId/:fileIndex
```

### Export
```
GET    /api/export/batch-candidates-excel/:batchId
GET    /api/export/batch-details-excel/:batchId
GET    /api/export/batch-candidates-pdf/:batchId
```

### Statistics
```
GET    /api/stats
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'multer'"
**Solution:** Run `npm install` in backend directory

### Issue: "File upload fails"
**Solution:** Check that `/backend/public/uploads/` directory exists

### Issue: "Token expired"
**Solution:** Login again to get new token

### Issue: "Cannot access admin panel"
**Solution:** Make sure you're logged in and token is valid

### Issue: "Export files not downloading"
**Solution:** Check that backend is running and accessible

### Issue: "Files stored but cannot view"
**Solution:** Ensure `/backend/public/` is served as static files

---

## 📋 Quick Checklist

- [ ] Install backend dependencies with `npm install`
- [ ] Create admin account via registration
- [ ] Test login/logout
- [ ] Upload sample file to candidate
- [ ] Download file
- [ ] Export candidate list
- [ ] Edit batch details
- [ ] Edit candidate in batch
- [ ] Test token expiration (wait 24h or restart server)

---

## 🔐 Security Notes

- Tokens expire in 24 hours
- JWT secret should be changed in production (use .env)
- Only authenticated admins can upload/edit/export files
- File size limited to 50MB
- Supported MIME types validated on backend
- Passwords hashed before storage

---

**Last Updated:** April 8, 2026
**Version:** 2.0 (Advanced Features)
