const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 }, // percentage
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  amountPaid: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
