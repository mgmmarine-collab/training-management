/**
 * Database Seed Script
 * This script populates the MongoDB database with sample data for testing
 * Run: node seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Course = require('./models/Course');
const Batch = require('./models/Batch');
const Candidate = require('./models/Candidate');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Course.deleteMany({});
    await Batch.deleteMany({});
    await Candidate.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // 1. Create Courses
    console.log('\n📚 Creating courses...');
    const courses = await Course.insertMany([
      {
        courseName: 'Excavator Operator',
        courseCode: 'EXC-001',
        duration: 3,
        description: 'Professional excavator operation training course',
        fee: 15000
      },
      {
        courseName: 'Fork Lift Operator',
        courseCode: 'FLO-001',
        duration: 2,
        description: 'Fork lift operation and safety training course',
        fee: 12000
      }
    ]);
    console.log(`✅ Created ${courses.length} courses`);

    // 2. Create Batches
    console.log('\n📚 Creating batches...');
    const excavatorCourse = courses.find(c => c.courseCode === 'EXC-001');
    const forkliftCourse = courses.find(c => c.courseCode === 'FLO-001');

    const batches = await Batch.insertMany([
      // Completed Batches
      {
        batchNumber: 1,
        batchName: 'Excavator Batch 1',
        courseId: excavatorCourse._id,
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-11-01'),
        status: 'completed'
      },
      {
        batchNumber: 2,
        batchName: 'Fork Lift Batch 1',
        courseId: forkliftCourse._id,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-11-15'),
        status: 'completed'
      },
      {
        batchNumber: 3,
        batchName: 'Excavator Batch 2',
        courseId: excavatorCourse._id,
        startDate: new Date('2023-10-01'),
        endDate: new Date('2024-01-01'),
        status: 'completed'
      },
      {
        batchNumber: 4,
        batchName: 'Fork Lift Batch 2',
        courseId: forkliftCourse._id,
        startDate: new Date('2023-11-01'),
        endDate: new Date('2024-01-15'),
        status: 'completed'
      },
      {
        batchNumber: 5,
        batchName: 'Excavator Batch 3',
        courseId: excavatorCourse._id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-04-01'),
        status: 'completed'
      },
      // Active Batch
      {
        batchNumber: 6,
        batchName: 'Fork Lift Batch 3',
        courseId: forkliftCourse._id,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-06-01'),
        status: 'active'
      },
      // Upcoming Batch
      {
        batchNumber: 7,
        batchName: 'Excavator Batch 4',
        courseId: excavatorCourse._id,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-08-01'),
        status: 'upcoming'
      }
    ]);
    console.log(`✅ Created ${batches.length} batches`);

    // 3. Create Candidates (5 per batch - first batch example)
    console.log('\n👥 Creating candidates...');
    const batch1 = batches.find(b => b.batchNumber === 1);

    const candidatesData = [
      {
        sNo: 1,
        name: 'Rajesh Kumar Singh',
        fatherName: 'Ram Prasad Singh',
        mobile: '9876543210',
        aadharNumber: '2345-6789-0123',
        idNumber: 'EXC001-001',
        email: 'rajesh.singh@email.com',
        address: '123 Main Street, Delhi',
        batchId: batch1._id,
        courseId: excavatorCourse._id,
        examDate: new Date('2023-10-15'),
        examScore: 85,
        examStatus: 'pass',
        certificateStatus: 'issued',
        certificateDate: new Date('2023-11-01'),
        isPlaced: true,
        companyName: 'Heavy Machines Ltd',
        jobRole: 'Excavator Operator',
        salary: 4.5,
        placementDate: new Date('2023-11-20'),
        hasIncentive: true,
        totalIncentiveAmount: 30000,
        incentiveStages: [
          {
            stageNumber: 1,
            stageName: 'Initiation',
            amount: 15000,
            received: true,
            receivedDate: new Date('2023-12-01')
          },
          {
            stageNumber: 2,
            stageName: 'Completion',
            amount: 15000,
            received: true,
            receivedDate: new Date('2024-01-15')
          }
        ]
      },
      {
        sNo: 2,
        name: 'Vikram Patel',
        fatherName: 'Suresh Patel',
        mobile: '9876543211',
        aadharNumber: '3456-7890-1234',
        idNumber: 'EXC001-002',
        email: 'vikram.patel@email.com',
        address: '456 Valley Road, Mumbai',
        batchId: batch1._id,
        courseId: excavatorCourse._id,
        examDate: new Date('2023-10-15'),
        examScore: 78,
        examStatus: 'pass',
        certificateStatus: 'issued',
        certificateDate: new Date('2023-11-01'),
        isPlaced: true,
        companyName: 'Construction Co India',
        jobRole: 'Machine Operator',
        salary: 3.8,
        placementDate: new Date('2023-12-05'),
        hasIncentive: true,
        totalIncentiveAmount: 30000,
        incentiveStages: [
          {
            stageNumber: 1,
            stageName: 'Initiation',
            amount: 15000,
            received: true,
            receivedDate: new Date('2023-12-15')
          },
          {
            stageNumber: 2,
            stageName: 'Completion',
            amount: 15000,
            received: true,
            receivedDate: new Date('2024-02-01')
          }
        ]
      },
      {
        sNo: 3,
        name: 'Amit Sharma',
        fatherName: 'Ramesh Sharma',
        mobile: '9876543212',
        aadharNumber: '4567-8901-2345',
        idNumber: 'EXC001-003',
        email: 'amit.sharma@email.com',
        address: '789 Hill Station, Bangalore',
        batchId: batch1._id,
        courseId: excavatorCourse._id,
        examDate: new Date('2023-10-15'),
        examScore: 88,
        examStatus: 'pass',
        certificateStatus: 'issued',
        certificateDate: new Date('2023-11-01'),
        isPlaced: true,
        companyName: 'Metro Construction',
        jobRole: 'Senior Equipment Operator',
        salary: 5.2,
        placementDate: new Date('2023-11-15'),
        hasIncentive: true,
        totalIncentiveAmount: 50000,
        incentiveStages: [
          {
            stageNumber: 1,
            stageName: 'Initiation',
            amount: 25000,
            received: true,
            receivedDate: new Date('2023-12-01')
          },
          {
            stageNumber: 2,
            stageName: 'Completion',
            amount: 25000,
            received: true,
            receivedDate: new Date('2024-01-20')
          }
        ]
      },
      {
        sNo: 4,
        name: 'Sanjay Verma',
        fatherName: 'Devendra Verma',
        mobile: '9876543213',
        aadharNumber: '5678-9012-3456',
        idNumber: 'EXC001-004',
        email: 'sanjay.verma@email.com',
        address: '234 Market Square, Chennai',
        batchId: batch1._id,
        courseId: excavatorCourse._id,
        examDate: new Date('2023-10-15'),
        examScore: 72,
        examStatus: 'pass',
        certificateStatus: 'issued',
        certificateDate: new Date('2023-11-01'),
        isPlaced: false,
        hasIncentive: false,
        totalIncentiveAmount: 0,
        incentiveStages: []
      },
      {
        sNo: 5,
        name: 'Pradeep Kumar',
        fatherName: 'Mohan Kumar',
        mobile: '9876543214',
        aadharNumber: '6789-0123-4567',
        idNumber: 'EXC001-005',
        email: 'pradeep.kumar@email.com',
        address: '567 Riverside, Kolkata',
        batchId: batch1._id,
        courseId: excavatorCourse._id,
        examDate: new Date('2023-10-15'),
        examScore: 82,
        examStatus: 'pass',
        certificateStatus: 'issued',
        certificateDate: new Date('2023-11-01'),
        isPlaced: true,
        companyName: 'Industrial Equipment Pvt Ltd',
        jobRole: 'Machine Operator',
        salary: 4.2,
        placementDate: new Date('2023-12-10'),
        hasIncentive: true,
        totalIncentiveAmount: 30000,
        incentiveStages: [
          {
            stageNumber: 1,
            stageName: 'Initiation',
            amount: 15000,
            received: true,
            receivedDate: new Date('2023-12-20')
          },
          {
            stageNumber: 2,
            stageName: 'Completion',
            amount: 15000,
            received: false
          }
        ]
      }
    ];

    const candidates = await Candidate.insertMany(candidatesData);
    console.log(`✅ Created ${candidates.length} candidates`);

    console.log('\n');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║      ✅ Database Seeding Complete!             ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`📊 Total Courses: ${courses.length}`);
    console.log(`📚 Total Batches: ${batches.length}`);
    console.log(`👥 Total Candidates: ${candidates.length}`);
    console.log('\n📍 Collections Ready:');
    console.log(`  • ${courses.length} Courses (Excavator, Fork Lift)`);
    console.log(`  • ${batches.length} Batches (5 completed, 1 active, 1 upcoming)`);
    console.log(`  • ${candidates.length} Sample Candidates (Batch 1)`);
    console.log('\n🚀 Start your application with:');
    console.log('  Frontend: npm run dev (in frontend directory)');
    console.log('  Backend:  npm run dev (in backend directory)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
