# 🚀 Quick Start Guide - Training Tracker with New UI

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Database (cloud or local)

---

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd training-tracker/backend

# Install dependencies (if not already installed)
npm install

# Create/Update .env file
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/training_db
# PORT=5000

# Start the server
npm run dev
# Server will run on http://localhost:5000
```

**Backend Routes Available:**
- `POST /api/batches` - Create batch
- `GET /api/batches` - Get all batches
- `GET /api/batches/:id` - Get specific batch
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch

- `POST /api/candidates` - Create candidate
- `GET /api/candidates` - Get candidates (supports filters)
- `GET /api/candidates/:id` - Get specific candidate
- `PUT /api/candidates/:id` - Update candidate

- `GET /api/stats` - Get overview statistics

**Query Parameters for /api/candidates:**
- `batchId` - Filter by batch
- `isPlaced` - Filter by placement (true/false)
- `certificateStatus` - Filter by certificate (issued/not_issued)
- `hasIncentive` - Filter by incentive (true/false)

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd training-tracker/frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
# Frontend will provide a local URL (typically http://localhost:5173)
```

---

## Application Features

### 📊 Dashboard
- Overview statistics (candidates, certificates, placements, incentives)
- Bar chart showing batch status
- Placement and certificate rate analytics
- Quick access to all batches

**Access:** `http://localhost:5173/`

### 📚 Batch View
- List of candidates in a specific batch
- Filter by: All, Exam Passed, Certified, Placed
- Statistics for the batch
- Individual candidate cards with status

**Access:** `http://localhost:5173/batch/:batchId`

### 👤 Candidate Detail
- Full candidate profile with personal information
- Education, batch, and course details
- Exam and certificate status
- Placement information (if placed)
- Government incentive stages timeline (if applicable)
- Progress tracking for incentive disbursement

**Access:** `http://localhost:5173/candidate/:candidateId`

### 💼 Placed Candidates
- All placed candidates with companies
- Sorting options: Name, Company, Salary
- Average salary calculation
- Placement ranking
- Salary display in ₹ (Indian Rupees)

**Access:** `http://localhost:5173/placed`

### 🎓 Certificates
- Tab-based view: Issued vs. Not Issued
- Statistics dashboard
- Certificate issuance dates
- Candidate and course information
- Pass rates and completion status

**Access:** `http://localhost:5173/certificates`

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/training_db
PORT=5000
```

### Frontend
No .env file needed. API URL is configured in `src/api/axios.js` as `http://localhost:5000/api`

---

## API Response Examples

### GET /api/stats
```json
{
  "total": 50,
  "certified": 45,
  "placed": 30,
  "incentive": 25,
  "totalIncentiveAmount": 500000
}
```

### GET /api/batches
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "batchNumber": 1,
    "batchName": "Batch 1",
    "courseId": { "_id": "...", "courseName": "Full Stack" },
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "status": "completed"
  }
]
```

### GET /api/candidates/:id
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "sNo": 1,
  "name": "John Doe",
  "mobile": "9876543210",
  "aadharNumber": "1234-5678-9012",
  "batchId": { "batchName": "Batch 1" },
  "courseId": { "courseName": "Full Stack" },
  "examStatus": "pass",
  "examScore": 85,
  "certificateStatus": "issued",
  "certificateDate": "2024-04-20",
  "isPlaced": true,
  "companyName": "TechCorp",
  "jobRole": "Junior Developer",
  "salary": 5,
  "placementDate": "2024-05-01",
  "hasIncentive": true,
  "totalIncentiveAmount": 20000,
  "incentiveStages": [
    {
      "stageNumber": 1,
      "stageName": "First Installment",
      "amount": 10000,
      "received": true,
      "receivedDate": "2024-05-15"
    },
    {
      "stageNumber": 2,
      "stageName": "Second Installment",
      "amount": 10000,
      "received": false
    }
  ]
}
```

---

## Testing the Application

### 1. Test Dashboard
- [ ] All statistics load correctly
- [ ] Bar chart renders
- [ ] Batch cards display
- [ ] Click on a batch card

### 2. Test Batch View
- [ ] Batch details display
- [ ] Statistics show correct counts
- [ ] Filters work (All, Passed, Certified, Placed)
- [ ] Click on a candidate card

### 3. Test Candidate Detail
- [ ] All sections load (personal, education, status)
- [ ] Placement section shows if placed
- [ ] Incentive timeline displays if applicable
- [ ] Progress bar updates correctly

### 4. Test Placed Candidates
- [ ] All placed candidates display
- [ ] Sorting works (Name, Company, Salary)
- [ ] Salaries display correctly
- [ ] Click candidate card

### 5. Test Certificates
- [ ] Tab navigation works
- [ ] Counts update when switching tabs
- [ ] Statistics display correctly
- [ ] Cards show correct information

---

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change port in .env
PORT=5001

# Or kill the process
lsof -i :5000
kill -9 <PID>
```

**MongoDB connection error:**
- Verify MONGO_URI in .env
- Check if Internet connection is stable
- Confirm MongoDB user credentials
- Check IP whitelist in MongoDB Atlas

**CORS errors:**
- Verify backend is running
- Check frontend is calling `http://localhost:5000/api`
- Restart both servers

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
# Frontend will use port 3000
```

**Cannot connect to backend:**
- Verify backend is running on port 5000
- Check axios.js configuration
- Clear browser cache
- Check for CORS errors in console

**Styles not loading (Tailwind CSS):**
```bash
# Reinstall tailwind
npm install -D tailwindcss postcss autoprefixer

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

---

## Building for Production

### Backend
```bash
# No build needed, just deploy server.js
# Ensure MongoDB is accessible from production server
```

### Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder with optimized files
```

---

## Deployment Notes

1. **Environment Variables:** Update MONGO_URI for production database
2. **API Base URL:** Update axios.js if backend is on different domain
3. **CORS:** Configure properly for production domain
4. **Security:** Use HTTPS in production
5. **Database:** Use MongoDB Atlas or production MongoDB instance

---

## Performance Tips

1. **Database Indexing:**
   - Create indexes on frequently queried fields
   - Index batch lookups, placement status, etc.

2. **Frontend Optimization:**
   - Minimize bundle size
   - Use lazy loading for images
   - Cache API responses

3. **Backend Optimization:**
   - Use pagination for large candidate lists
   - Cache frequently accessed data
   - Optimize database queries

---

## Support & Documentation

- **MongoDB:** https://docs.mongodb.com
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Recharts:** https://recharts.org
- **Express:** https://expressjs.com
- **Mongoose:** https://mongoosejs.com

---

## Version Info

- **React:** 19.2.4
- **React Router:** 7.14.0
- **Tailwind CSS:** 3.4.1
- **Recharts:** 3.8.1
- **Express:** 5.2.1
- **Mongoose:** 9.4.1
- **Node.js:** 14+ recommended

---

## Next Steps

1. ✅ Start both backend and frontend servers
2. ✅ Open http://localhost:5173 in browser
3. ✅ Create or import data via API
4. ✅ Test all pages and features
5. ✅ Deploy to production

---

**Last Updated:** April 2026
**Status:** Ready for Production ✅

For any issues, check the UI_IMPROVEMENTS.md and BEFORE_AFTER.md files for more details.
