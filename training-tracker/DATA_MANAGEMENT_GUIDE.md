# 📊 Training Tracker - Complete Data Management & Enhanced UI Guide

## 🎯 What's New in This Update

### 1. ✅ Database Schema Updates
- **New Field in Candidate Model:** `fatherName` - Father's name
- **Additional Fields:** `email`, `address` for better candidate information

### 2. 📝 Admin Panel
- Add new Courses (Excavator Operator, Fork Lift Operator)
- Add new Batches with dates and status
- Add new Candidates with complete information

### 3. 📊 Enhanced Dashboard
- **Batch Status Overview** (Top Priority)
  - Currently Running Batches 🚀
  - Completed Batches ✅
  - Upcoming Batches 📅
- **Animated UI** with fade-in effects and bounce animations
- **Real-time Statistics** - Placement rate, certificate rate, incentive tracking

### 4. 🗄️ MongoDB Collections
- **courses** - Stores course information
- **batches** - Batch details with status (active, completed, upcoming)
- **candidates** - Complete candidate information with placements and incentives

---

## 🚀 Quick Start

### Step 1: Database Setup

#### Option A: Using Seed Script (Recommended)

```bash
cd backend
npm run seed
```

This will:
- Create courses: Excavator Operator, Fork Lift Operator
- Create 7 batches (5 completed, 1 active, 1 upcoming)
- Create 5 sample candidates with placement and incentive data

#### Option B: Manual MongoDB Setup

1. **Open MongoDB Atlas** or local MongoDB
2. **Run the setup scripts** from `MONGODB_SETUP.md`
3. **Insert sample data** using the provided Mongo shell commands

### Step 2: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

### Step 3: Access the Application

- **Dashboard:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Placements:** http://localhost:5173/placed
- **Certificates:** http://localhost:5173/certificates

---

## 📊 Dashboard - Batch Status Overview

### What's Displayed (Top of Dashboard)

**Three Category Cards:**

1. **Currently Running** 🚀
   - Shows active batches running between start and end dates
   - Lists batch numbers and course names
   - Color: Blue gradient

2. **Completed** ✅
   - Shows finished batches
   - All batches marked as "completed" status
   - Color: Green gradient

3. **Upcoming** 📅
   - Shows batches that haven't started yet
   - Start date is in the future
   - Color: Amber/Orange gradient

### Features
- **Animated Count Numbers** - Bounce animation
- **Batch Details** - Shows first 3 batches, "+X more" for additional
- **Emoji Icons** - Visual appeal
- **Responsive Design** - Works on mobile, tablet, desktop

### Technical Implementation

```javascript
// API Response includes batch categories
{
  "total": 50,
  "certified": 45,
  "placed": 30,
  "incentive": 25,
  "totalIncentiveAmount": 500000,
  "batches": {
    "active": 1,
    "completed": 5,
    "upcoming": 1,
    "total": 7
  }
}
```

---

## 🔧 Admin Panel

### Access: http://localhost:5173/admin

### Three Tabs:

#### 1. 👥 Add Candidates Tab

**Fields:**
- Name* (required)
- **Father's Name** (NEW)
- Mobile Number
- Aadhar Number
- ID Number
- Email
- Address
- Batch Selection* (required)
- Course Selection

**Note:** Serial Number (sNo) is **auto-incremented** per batch - no need to enter it manually!

**Example Data (sNo is auto-assigned):**
```javascript
{
  name: "Rajesh Kumar Singh",
  fatherName: "Ram Prasad Singh",  // ← NEW FIELD
  mobile: "9876543210",
  aadharNumber: "2345-6789-0123",
  idNumber: "EXC001-001",
  email: "rajesh.singh@email.com",
  address: "123 Main Street, Delhi",
  batchId: "507f1f77bcf86cd799439011",
  courseId: "507f1f77bcf86cd799439001"
  // ← sNo is auto-generated as 1, 2, 3... per batch
}
```

#### 2. 📚 Add Batches Tab

**Fields:**
- Batch Number* (required)
- Batch Name
- Course Selection* (required)
- Status (upcoming, active, completed)
- Start Date
- End Date

**Example Data:**
```javascript
{
  batchNumber: 6,
  batchName: "Fork Lift Batch 3",
  courseId: "507f1f77bcf86cd799439002",
  startDate: "2026-04-01",
  endDate: "2026-06-01",
  status: "active"
}
```

#### 3. 🎓 Add Courses Tab

**Fields:**
- Course Name* (required)
- Course Code
- Duration (months)
- Description
- Fee (₹)

**Example Data:**
```javascript
{
  courseName: "Excavator Operator",
  courseCode: "EXC-001",
  duration: 3,
  description: "Professional excavator operation training",
  fee: 15000
}
```

### Admin Panel Features
- **Form Validation** - Required fields marked with *
- **Success/Error Messages** - Toast notifications
- **Dropdown Selections** - Dynamic batch/course selection
- **Loading States** - Button feedback during submission
- **Responsive Design** - Mobile-friendly forms

---

## 📱 Updated Candidate Model

### Schema Structure:

```javascript
{
  // Personal Information
  sNo: Number,
  name: String (required),
  fatherName: String,  // ← NEW
  mobile: String,
  aadharNumber: String,
  idNumber: String,
  email: String,       // ← NEW
  address: String,     // ← NEW
  
  // Batch & Course
  batchId: ObjectId (ref: Batch),
  courseId: ObjectId (ref: Course),
  
  // Exam
  examDate: Date,
  examScore: Number,
  examStatus: "pending" | "pass" | "fail",
  
  // Certificate
  certificateStatus: "not_issued" | "issued",
  certificateDate: Date,
  
  // Placement
  isPlaced: Boolean,
  companyName: String,
  jobRole: String,
  salary: Number (LPA),
  placementDate: Date,
  
  // Government Incentive
  hasIncentive: Boolean,
  totalIncentiveAmount: Number,
  incentiveStages: [
    {
      stageNumber: Number,
      stageName: String,
      amount: Number,
      received: Boolean,
      receivedDate: Date
    }
  ]
}
```

---

## 🎬 Animations in Dashboard

### Fade-In Effect
- Stats cards fade in sequentially
- Staggered animation delays (0.1s between each)
- Smooth from transparent to visible

### Bounce Animation
- Batch count numbers bounce
- Infinite bounce effect
- Draws attention to key metrics

### Hover Effects
- Scale: 105% on hover
- Shadow: lg → xl on hover
- Color transitions: 300ms smooth

---

## 📊 Dashboard Sections (Complete Overview)

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
│  TrainHub Logo     Dashboard | Placements | Certificates│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Header Section                        │
│  Training Dashboard   [🔧 Admin Panel Button]            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           Statistics Cards (4 columns)                   │
│  👥 Candidates   🎓 Certified   💼 Placed   💰 Incentive │
│     Count          Count         Count         Amount     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         Batch Status Overview (3 columns)               │
│  🚀 ACTIVE     ✅ COMPLETED     📅 UPCOMING             │
│  Running       Finished        Not Started              │
│  Batches: ...  Batches: ...    Batches: ...             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Charts Section (2 columns)                 │
│  📊 Bar Chart          📈 Placement Stats               │
│  Batch Overview        Pass Rate, Placement            │
│                        Certificate Rate                │
│                        Incentive Disbursed             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              All Batches Grid (3 columns)               │
│  Batch Cards with links to detailed views              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔀 API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get specific course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Batches
- `GET /api/batches` - Get all batches
- `POST /api/batches` - Create batch
- `GET /api/batches/:id` - Get specific batch
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch

### Candidates
- `GET /api/candidates` - Get all candidates (with filters)
- `POST /api/candidates` - Create candidate
- `GET /api/candidates/:id` - Get specific candidate
- `PUT /api/candidates/:id` - Update candidate
- Query params: `batchId`, `isPlaced`, `certificateStatus`, `hasIncentive`

### Statistics
- `GET /api/stats` - Get dashboard statistics (including batch categories)

---

## 📝 Example: Adding Data via Admin Panel

### Step 1: Add Course
1. Go to http://localhost:5173/admin
2. Click "Add Courses" tab
3. Fill in:
   - Course Name: "Excavator Operator"
   - Course Code: "EXC-001"
   - Duration: 3
   - Fee: 15000
4. Click "Add Course"
5. Success message appears

### Step 2: Add Batch
1. Click "Add Batches" tab
2. Select the course you just created
3. Fill in:
   - Batch Number: 1
   - Batch Name: "Excavator Batch 1"
   - Status: "active"
   - Start Date: 2026-04-01
   - End Date: 2026-06-01
4. Click "Add Batch"

### Step 3: Add Candidate
1. Click "Add Candidates" tab
2. Select the batch you created
3. Fill in:
   - Name: "John Doe"
   - Father's Name: "James Doe"
   - Mobile: 9876543210
   - Aadhar: 1234-5678-9012
   - Email: john@example.com
   - Address: "123 Street, City"
4. Click "Add Candidate"
5. Serial Number is automatically assigned (1, 2, 3... per batch)

### Step 4: View in Dashboard
1. Go to Dashboard (http://localhost:5173)
2. See batch in "Currently Running" section (if dates match)
3. Stats update automatically
4. Click batch to see candidate details

---

## 🗄️ MongoDB Collections Schema

### Courses Collection
```javascript
db.courses
├── _id: ObjectId
├── courseName: String
├── courseCode: String
├── duration: Number
├── description: String
├── fee: Number
├── createdAt: Date
└── updatedAt: Date
```

### Batches Collection
```javascript
db.batches
├── _id: ObjectId
├── batchNumber: Number
├── batchName: String
├── courseId: ObjectId (ref: courses)
├── startDate: Date
├── endDate: Date
├── status: String (active/completed/upcoming)
├── createdAt: Date
└── updatedAt: Date
```

### Candidates Collection
```javascript
db.candidates
├── _id: ObjectId
├── sNo: Number (auto-incremented per batch)
├── name: String
├── fatherName: String ← NEW
├── mobile: String
├── aadharNumber: String
├── idNumber: String
├── email: String ← NEW
├── address: String ← NEW
├── batchId: ObjectId (ref: batches)
├── courseId: ObjectId (ref: courses)
├── examDate: Date
├── examScore: Number
├── examStatus: String
├── certificateStatus: String
├── certificateDate: Date
├── isPlaced: Boolean
├── companyName: String
├── jobRole: String
├── salary: Number
├── placementDate: Date
├── hasIncentive: Boolean
├── totalIncentiveAmount: Number
├── incentiveStages: Array
├── createdAt: Date
└── updatedAt: Date
```

---

## 🐛 Troubleshooting

### Issue: Cannot add courses/batches
**Solution:** Make sure backend is running and `/api/courses` endpoint is accessible

### Issue: Batch doesn't show in "Currently Running"
**Solution:** Check batch dates are correct and status is "active"

### Issue: Admin panel shows "Admin not found"
**Solution:** Refresh the page or clear browser cache

### Issue: Can't connect to MongoDB
**Solution:** 
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist
- Ensure database name is "training_db"

---

## 📞 File Structure Update

```
backend/
├── routes/
│   ├── batchRoutes.js
│   ├── candidateRoutes.js
│   ├── courseRoutes.js (NEW)
│   └── statsRoutes.js (UPDATED)
├── models/
│   ├── Batch.js
│   ├── Candidate.js (UPDATED - fatherName field)
│   └── Course.js
├── seed.js (NEW) - Database seeding script
└── server.js (UPDATED - added /api/courses route)

frontend/
├── pages/
│   ├── Dashboard.jsx (UPDATED - batch categories, animations)
│   ├── Admin.jsx (NEW) - Admin panel
│   ├── BatchView.jsx
│   ├── CandidateDetail.jsx
│   ├── PlacedCandidates.jsx
│   └── Certificates.jsx
├── components/
│   └── Navbar.jsx
└── App.jsx (UPDATED - added /admin route)
```

---

## ✅ Checklist - Setup Complete

- [ ] Install dependencies: `npm install` in both frontend & backend
- [ ] Update MongoDB connection string in `.env`
- [ ] Run seed script: `npm run seed` (in backend)
- [ ] Start backend: `npm run dev` (in backend)
- [ ] Start frontend: `npm run dev` (in frontend)
- [ ] Open Dashboard: http://localhost:5173
- [ ] Open Admin Panel: http://localhost:5173/admin
- [ ] Add a test course
- [ ] Add a test batch
- [ ] Add a test candidate
- [ ] Verify data appears in Dashboard

---

## 🎯 Key Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Admin Panel | ✅ NEW | `/admin` |
| Add Courses | ✅ NEW | Admin → Courses Tab |
| Add Batches | ✅ NEW | Admin → Batches Tab |
| Add Candidates | ✅ NEW | Admin → Candidates Tab |
| Batch Categories | ✅ NEW | Dashboard Top Section |
| Father Name Field | ✅ NEW | Candidate Model |
| Email Field | ✅ NEW | Candidate Model |
| Address Field | ✅ NEW | Candidate Model |
| Animated Dashboard | ✅ ENHANCED | Dashboard |
| Batch Status Tracking | ✅ ENHANCED | Dashboard + Stats API |
| Seed Script | ✅ NEW | Backend: `npm run seed` |

---

**Ready to use!** 🚀 All features are production-ready and tested.
