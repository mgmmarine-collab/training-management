const mongoose = require('mongoose');

const incentiveStageSchema = new mongoose.Schema({
  stageNumber: Number,
  stageName: String,
  amount: Number,
  received: { type: Boolean, default: false },
  receivedDate: Date
});

const fileSchema = new mongoose.Schema({
  fileId: String, // Google Drive file ID
  fileName: String,
  fileType: String, // 'offer_letter', 'pay_slip', 'certificate'
  viewLink: String, // Google Drive view link
  downloadLink: String, // Google Drive download link
  uploadedDate: { type: Date, default: Date.now },
  fileSize: Number,
  mimeType: String // 'application/pdf', 'image/jpeg', etc.
});

const candidateSchema = new mongoose.Schema({
  sNo: Number,
  name: { type: String, required: true },
  fatherName: String, // Added: Father's name
  mobile: String,
  aadharNumber: String,
  idNumber: String,
  email: String,
  address: String,
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },

  // Exam
  examDate: Date,
  examScore: Number,
  examStatus: { type: String, enum: ['pending', 'pass', 'fail'], default: 'pending' },

  // Certificate
  certificateStatus: { type: String, enum: ['not_issued', 'issued'], default: 'not_issued' },
  certificateDate: Date,
  certificateFiles: [fileSchema], // Store certificate documents

  // Placement
  isPlaced: { type: Boolean, default: false },
  companyName: String,
  jobRole: String,
  salary: Number,
  placementDate: Date,
  placementFiles: [fileSchema], // Store offer letter, pay slip, etc.

  // Government incentive
  hasIncentive: { type: Boolean, default: false },
  totalIncentiveAmount: Number,
  incentiveStages: [incentiveStageSchema],

  // Google Drive folder for candidate files
  googleDriveFolderId: String,

}, { timestamps: true });

// Auto-increment sNo before saving
candidateSchema.pre('save', async function() {
  if (!this.sNo && this.batchId) {  // Only auto-increment if batchId exists
    try {
      // Find the highest sNo in the batch
      const lastCandidate = await mongoose.model('Candidate').findOne({ batchId: this.batchId })
        .sort({ sNo: -1 });
      
      // Set sNo to 1 if no candidates in batch, otherwise increment
      this.sNo = lastCandidate ? lastCandidate.sNo + 1 : 1;
    } catch (error) {
      console.error('Error auto-incrementing sNo:', error);
      throw error;
    }
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);