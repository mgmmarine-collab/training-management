# 🗄️ MongoDB Database Setup Guide

## Database: `training_db`

### Collections Overview

```
training_db/
├── courses
├── batches
└── candidates
```

---

## 1. COURSES Collection

**Example Documents:**

```javascript
// Excavator Operator Course
{
  "_id": ObjectId("507f1f77bcf86cd799439001"),
  "courseName": "Excavator Operator",
  "courseCode": "EXC-001",
  "duration": 3,  // months
  "description": "Professional excavator operation training",
  "fee": 15000,
  "createdAt": ISODate("2024-01-01"),
  "updatedAt": ISODate("2024-01-01")
}

// Fork Lift Operator Course
{
  "_id": ObjectId("507f1f77bcf86cd799439002"),
  "courseName": "Fork Lift Operator",
  "courseCode": "FLO-001",
  "duration": 2,  // months
  "description": "Fork lift operation and safety training",
  "fee": 12000,
  "createdAt": ISODate("2024-01-01"),
  "updatedAt": ISODate("2024-01-01")
}
```

### Mongo Shell Insert Commands:

```javascript
// Switch to training_db
use training_db

// Insert Courses
db.courses.insertMany([
  {
    "courseName": "Excavator Operator",
    "courseCode": "EXC-001",
    "duration": 3,
    "description": "Professional excavator operation training",
    "fee": 15000,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "courseName": "Fork Lift Operator",
    "courseCode": "FLO-001",
    "duration": 2,
    "description": "Fork lift operation and safety training",
    "fee": 12000,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);
```

---

## 2. BATCHES Collection

**Index Data (5 Completed + Current Active + Future Batches):**

```javascript
// Historical Completed Batches
[
  {
    "batchNumber": 1,
    "batchName": "Excavator Batch 1",
    "courseId": ObjectId("507f1f77bcf86cd799439001"),
    "startDate": ISODate("2023-08-01"),
    "endDate": ISODate("2023-11-01"),
    "status": "completed",
    "createdAt": ISODate("2023-08-01"),
    "updatedAt": ISODate("2024-01-01")
  },
  {
    "batchNumber": 2,
    "batchName": "Fork Lift Batch 1",
    "courseId": ObjectId("507f1f77bcf86cd799439002"),
    "startDate": ISODate("2023-09-01"),
    "endDate": ISODate("2023-11-15"),
    "status": "completed",
    "createdAt": ISODate("2023-09-01"),
    "updatedAt": ISODate("2024-01-01")
  },
  {
    "batchNumber": 3,
    "batchName": "Excavator Batch 2",
    "courseId": ObjectId("507f1f77bcf86cd799439001"),
    "startDate": ISODate("2023-10-01"),
    "endDate": ISODate("2024-01-01"),
    "status": "completed",
    "createdAt": ISODate("2023-10-01"),
    "updatedAt": ISODate("2024-01-01")
  },
  {
    "batchNumber": 4,
    "batchName": "Fork Lift Batch 2",
    "courseId": ObjectId("507f1f77bcf86cd799439002"),
    "startDate": ISODate("2023-11-01"),
    "endDate": ISODate("2024-01-15"),
    "status": "completed",
    "createdAt": ISODate("2023-11-01"),
    "updatedAt": ISODate("2024-01-01")
  },
  {
    "batchNumber": 5,
    "batchName": "Excavator Batch 3",
    "courseId": ObjectId("507f1f77bcf86cd799439001"),
    "startDate": ISODate("2024-01-01"),
    "endDate": ISODate("2024-04-01"),
    "status": "completed",
    "createdAt": ISODate("2024-01-01"),
    "updatedAt": ISODate("2024-04-05")
  },
  
  // Current Active Batch
  {
    "batchNumber": 6,
    "batchName": "Fork Lift Batch 3",
    "courseId": ObjectId("507f1f77bcf86cd799439002"),
    "startDate": ISODate("2026-04-01"),
    "endDate": ISODate("2026-06-01"),
    "status": "active",
    "createdAt": ISODate("2026-04-01"),
    "updatedAt": ISODate("2026-04-08")
  },
  
  // Upcoming Batches
  {
    "batchNumber": 7,
    "batchName": "Excavator Batch 4",
    "courseId": ObjectId("507f1f77bcf86cd799439001"),
    "startDate": ISODate("2026-05-01"),
    "endDate": ISODate("2026-08-01"),
    "status": "upcoming",
    "createdAt": ISODate("2026-04-08"),
    "updatedAt": ISODate("2026-04-08")
  }
]
```

### Mongo Shell Insert Commands:

```javascript
use training_db

// Get Course IDs first
const excavatorId = db.courses.findOne({courseCode: "EXC-001"})._id;
const forkliftId = db.courses.findOne({courseCode: "FLO-001"})._id;

// Insert Batches
db.batches.insertMany([
  {
    "batchNumber": 1,
    "batchName": "Excavator Batch 1",
    "courseId": excavatorId,
    "startDate": new Date("2023-08-01"),
    "endDate": new Date("2023-11-01"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 2,
    "batchName": "Fork Lift Batch 1",
    "courseId": forkliftId,
    "startDate": new Date("2023-09-01"),
    "endDate": new Date("2023-11-15"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 3,
    "batchName": "Excavator Batch 2",
    "courseId": excavatorId,
    "startDate": new Date("2023-10-01"),
    "endDate": new Date("2024-01-01"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 4,
    "batchName": "Fork Lift Batch 2",
    "courseId": forkliftId,
    "startDate": new Date("2023-11-01"),
    "endDate": new Date("2024-01-15"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 5,
    "batchName": "Excavator Batch 3",
    "courseId": excavatorId,
    "startDate": new Date("2024-01-01"),
    "endDate": new Date("2024-04-01"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 6,
    "batchName": "Fork Lift Batch 3",
    "courseId": forkliftId,
    "startDate": new Date("2026-04-01"),
    "endDate": new Date("2026-06-01"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 7,
    "batchName": "Excavator Batch 4",
    "courseId": excavatorId,
    "startDate": new Date("2026-05-01"),
    "endDate": new Date("2026-08-01"),
    "status": "upcoming",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);
```

---

## 3. CANDIDATES Collection

**Schema with Father Name Field:**

```javascript
{
  "_id": ObjectId,
  
  // Personal Information
  "sNo": Number,
  "name": String (required),
  "fatherName": String,  // ← NEW FIELD
  "mobile": String,
  "aadharNumber": String,
  "idNumber": String,
  "email": String,
  "address": String,
  
  // Batch & Course
  "batchId": ObjectId (ref: Batch),
  "courseId": ObjectId (ref: Course),
  
  // Exam
  "examDate": Date,
  "examScore": Number,
  "examStatus": "pending" | "pass" | "fail",
  
  // Certificate
  "certificateStatus": "not_issued" | "issued",
  "certificateDate": Date,
  
  // Placement
  "isPlaced": Boolean,
  "companyName": String,
  "jobRole": String,
  "salary": Number (in LPA),
  "placementDate": Date,
  
  // Government Incentive
  "hasIncentive": Boolean,
  "totalIncentiveAmount": Number,
  "incentiveStages": [
    {
      "stageNumber": Number,
      "stageName": String,
      "amount": Number,
      "received": Boolean,
      "receivedDate": Date
    }
  ],
  
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Sample Candidate Data (5 from each batch - Completed):

```javascript
use training_db

const excavatorId = db.courses.findOne({courseCode: "EXC-001"})._id;
const batch1Id = db.batches.findOne({batchNumber: 1})._id;
const batch2Id = db.batches.findOne({batchNumber: 2})._id;

// Excavator Batch 1 - 5 candidates
db.candidates.insertMany([
  {
    "sNo": 1,
    "name": "Rajesh Kumar Singh",
    "fatherName": "Ram Prasad Singh",
    "mobile": "9876543210",
    "aadharNumber": "2345-6789-0123",
    "idNumber": "EXC001-001",
    "email": "rajesh.singh@email.com",
    "address": "123 Main Street, Delhi",
    "batchId": batch1Id,
    "courseId": excavatorId,
    "examDate": new Date("2023-10-15"),
    "examScore": 85,
    "examStatus": "pass",
    "certificateStatus": "issued",
    "certificateDate": new Date("2023-11-01"),
    "isPlaced": true,
    "companyName": "Heavy Machines Ltd",
    "jobRole": "Excavator Operator",
    "salary": 4.5,
    "placementDate": new Date("2023-11-20"),
    "hasIncentive": true,
    "totalIncentiveAmount": 30000,
    "incentiveStages": [
      {"stageNumber": 1, "stageName": "Initiation", "amount": 15000, "received": true, "receivedDate": new Date("2023-12-01")},
      {"stageNumber": 2, "stageName": "Completion", "amount": 15000, "received": true, "receivedDate": new Date("2024-01-15")}
    ]
  },
  {
    "sNo": 2,
    "name": "Vikram Patel",
    "fatherName": "Suresh Patel",
    "mobile": "9876543211",
    "aadharNumber": "3456-7890-1234",
    "idNumber": "EXC001-002",
    "email": "vikram.patel@email.com",
    "address": "456 Valley Road, Mumbai",
    "batchId": batch1Id,
    "courseId": excavatorId,
    "examDate": new Date("2023-10-15"),
    "examScore": 78,
    "examStatus": "pass",
    "certificateStatus": "issued",
    "certificateDate": new Date("2023-11-01"),
    "isPlaced": true,
    "companyName": "Construction Co India",
    "jobRole": "Machine Operator",
    "salary": 3.8,
    "placementDate": new Date("2023-12-05"),
    "hasIncentive": true,
    "totalIncentiveAmount": 30000,
    "incentiveStages": [
      {"stageNumber": 1, "stageName": "Initiation", "amount": 15000, "received": true, "receivedDate": new Date("2023-12-15")},
      {"stageNumber": 2, "stageName": "Completion", "amount": 15000, "received": true, "receivedDate": new Date("2024-02-01")}
    ]
  },
  {
    "sNo": 3,
    "name": "Amit Sharma",
    "fatherName": "Ramesh Sharma",
    "mobile": "9876543212",
    "aadharNumber": "4567-8901-2345",
    "idNumber": "EXC001-003",
    "email": "amit.sharma@email.com",
    "address": "789 Hill Station, Bangalore",
    "batchId": batch1Id,
    "courseId": excavatorId,
    "examDate": new Date("2023-10-15"),
    "examScore": 88,
    "examStatus": "pass",
    "certificateStatus": "issued",
    "certificateDate": new Date("2023-11-01"),
    "isPlaced": true,
    "companyName": "Metro Construction",
    "jobRole": "Senior Equipment Operator",
    "salary": 5.2,
    "placementDate": new Date("2023-11-15"),
    "hasIncentive": true,
    "totalIncentiveAmount": 50000,
    "incentiveStages": [
      {"stageNumber": 1, "stageName": "Initiation", "amount": 25000, "received": true, "receivedDate": new Date("2023-12-01")},
      {"stageNumber": 2, "stageName": "Completion", "amount": 25000, "received": true, "receivedDate": new Date("2024-01-20")}
    ]
  },
  {
    "sNo": 4,
    "name": "Sanjay Verma",
    "fatherName": "Devendra Verma",
    "mobile": "9876543213",
    "aadharNumber": "5678-9012-3456",
    "idNumber": "EXC001-004",
    "email": "sanjay.verma@email.com",
    "address": "234 Market Square, Chennai",
    "batchId": batch1Id,
    "courseId": excavatorId,
    "examDate": new Date("2023-10-15"),
    "examScore": 72,
    "examStatus": "pass",
    "certificateStatus": "issued",
    "certificateDate": new Date("2023-11-01"),
    "isPlaced": false,
    "hasIncentive": false,
    "totalIncentiveAmount": 0,
    "incentiveStages": []
  },
  {
    "sNo": 5,
    "name": "Pradeep Kumar",
    "fatherName": "Mohan Kumar",
    "mobile": "9876543214",
    "aadharNumber": "6789-0123-4567",
    "idNumber": "EXC001-005",
    "email": "pradeep.kumar@email.com",
    "address": "567 Riverside, Kolkata",
    "batchId": batch1Id,
    "courseId": excavatorId,
    "examDate": new Date("2023-10-15"),
    "examScore": 82,
    "examStatus": "pass",
    "certificateStatus": "issued",
    "certificateDate": new Date("2023-11-01"),
    "isPlaced": true,
    "companyName": "Industrial Equipment Pvt Ltd",
    "jobRole": "Machine Operator",
    "salary": 4.2,
    "placementDate": new Date("2023-12-10"),
    "hasIncentive": true,
    "totalIncentiveAmount": 30000,
    "incentiveStages": [
      {"stageNumber": 1, "stageName": "Initiation", "amount": 15000, "received": true, "receivedDate": new Date("2023-12-20")},
      {"stageNumber": 2, "stageName": "Completion", "amount": 15000, "received": false}
    ]
  }
]);
```

---

## 4. Database Indexes

For better query performance, create these indexes:

```javascript
use training_db

// Candidate indexes
db.candidates.createIndex({ "batchId": 1 });
db.candidates.createIndex({ "courseId": 1 });
db.candidates.createIndex({ "isPlaced": 1 });
db.candidates.createIndex({ "certificateStatus": 1 });
db.candidates.createIndex({ "hasIncentive": 1 });

// Batch indexes
db.batches.createIndex({ "courseId": 1 });
db.batches.createIndex({ "status": 1 });
db.batches.createIndex({ "startDate": 1, "endDate": 1 });

// Course indexes
db.courses.createIndex({ "courseName": 1 }, { "unique": false });
```

---

## 5. Complete Setup Script

Run this entire script in MongoDB shell:

```javascript
use training_db

// 1. Insert Courses
db.courses.insertMany([
  {
    "courseName": "Excavator Operator",
    "courseCode": "EXC-001",
    "duration": 3,
    "description": "Professional excavator operation training",
    "fee": 15000,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "courseName": "Fork Lift Operator",
    "courseCode": "FLO-001",
    "duration": 2,
    "description": "Fork lift operation and safety training",
    "fee": 12000,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

// Get IDs for next inserts
const excavatorId = db.courses.findOne({courseCode: "EXC-001"})._id;
const forkliftId = db.courses.findOne({courseCode: "FLO-001"})._id;

// 2. Insert Batches
db.batches.insertMany([
  {
    "batchNumber": 1,
    "batchName": "Excavator Batch 1",
    "courseId": excavatorId,
    "startDate": new Date("2023-08-01"),
    "endDate": new Date("2023-11-01"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 2,
    "batchName": "Fork Lift Batch 1",
    "courseId": forkliftId,
    "startDate": new Date("2023-09-01"),
    "endDate": new Date("2023-11-15"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 3,
    "batchName": "Excavator Batch 2",
    "courseId": excavatorId,
    "startDate": new Date("2023-10-01"),
    "endDate": new Date("2024-01-01"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 4,
    "batchName": "Fork Lift Batch 2",
    "courseId": forkliftId,
    "startDate": new Date("2023-11-01"),
    "endDate": new Date("2024-01-15"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 5,
    "batchName": "Excavator Batch 3",
    "courseId": excavatorId,
    "startDate": new Date("2024-01-01"),
    "endDate": new Date("2024-04-01"),
    "status": "completed",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 6,
    "batchName": "Fork Lift Batch 3",
    "courseId": forkliftId,
    "startDate": new Date("2026-04-01"),
    "endDate": new Date("2026-06-01"),
    "status": "active",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "batchNumber": 7,
    "batchName": "Excavator Batch 4",
    "courseId": excavatorId,
    "startDate": new Date("2026-05-01"),
    "endDate": new Date("2026-08-01"),
    "status": "upcoming",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

// Get batch IDs for candidate inserts
const batch1Id = db.batches.findOne({batchNumber: 1})._id;
const batch6Id = db.batches.findOne({batchNumber: 6})._id;

// 3. Insert Candidates (sample for batch 1)
db.candidates.insertMany([
  {
    "sNo": 1,
    "name": "Rajesh Kumar Singh",
    "fatherName": "Ram Prasad Singh",
    "mobile": "9876543210",
    "aadharNumber": "2345-6789-0123",
    "idNumber": "EXC001-001",
    "email": "rajesh.singh@email.com",
    "address": "123 Main Street, Delhi",
    "batchId": batch1Id,
    "courseId": excavatorId,
    "examDate": new Date("2023-10-15"),
    "examScore": 85,
    "examStatus": "pass",
    "certificateStatus": "issued",
    "certificateDate": new Date("2023-11-01"),
    "isPlaced": true,
    "companyName": "Heavy Machines Ltd",
    "jobRole": "Excavator Operator",
    "salary": 4.5,
    "placementDate": new Date("2023-11-20"),
    "hasIncentive": true,
    "totalIncentiveAmount": 30000,
    "incentiveStages": [
      {"stageNumber": 1, "stageName": "Initiation", "amount": 15000, "received": true, "receivedDate": new Date("2023-12-01")},
      {"stageNumber": 2, "stageName": "Completion", "amount": 15000, "received": true, "receivedDate": new Date("2024-01-15")}
    ],
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

// 4. Create Indexes
db.candidates.createIndex({ "batchId": 1 });
db.candidates.createIndex({ "courseId": 1 });
db.candidates.createIndex({ "isPlaced": 1 });
db.candidates.createIndex({ "certificateStatus": 1 });
db.candidates.createIndex({ "hasIncentive": 1 });
db.batches.createIndex({ "courseId": 1 });
db.batches.createIndex({ "status": 1 });
db.batches.createIndex({ "startDate": 1, "endDate": 1 });
db.courses.createIndex({ "courseName": 1 });

print("✅ Database setup complete!");
```

---

## 6. Connection Info

**MongoDB URI Format:**
```
mongodb+srv://[username]:[password]@[cluster].mongodb.net/training_db?retryWrites=true&w=majority
```

**Update your `.env` file:**
```
MONGO_URI=mongodb+srv://MGM:Vishnuap1%40@cluster0.kqfa7vu.mongodb.net/training_db?retryWrites=true&w=majority
PORT=5000
```

---

## 7. Verification Queries

After setup, verify data:

```javascript
use training_db

// Check collections
show collections

// Count documents
db.courses.countDocuments()      // Should be 2
db.batches.countDocuments()      // Should be 7
db.candidates.countDocuments()   // Should be 1+ (based on inserts)

// View documents
db.courses.find().pretty()
db.batches.find().pretty()
db.candidates.find().pretty()
```

---

## 8. New Fields Added to Candidate Model

The following fields have been added to the Candidate schema:

- **fatherName** (String) - Father's name ✅ NEW
- **email** (String) - Email address ✅ NEW
- **address** (String) - Residential address ✅ NEW

---

## 9. Using Admin Panel

Once the database is setup:

1. Go to `http://localhost:5173/admin`
2. Add new Courses
3. Add new Batches
4. Add Candidates with all required information

---

**Database Ready!** 🚀
