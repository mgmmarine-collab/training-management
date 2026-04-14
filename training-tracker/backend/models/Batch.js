const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchNumber: { type: Number, required: true }, // 1, 2, 3...
  batchName: String, // "Batch 1"
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  startDate: Date,
  endDate: Date,
  assessmentDate: Date, // Date when assessment/exam is conducted
  certificateIssuingDate: Date, // Date when certificates are issued (mainly for completed batches)
  status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);