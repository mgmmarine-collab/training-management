const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: String,
  duration: Number, // in months
  description: String,
  fee: Number
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);