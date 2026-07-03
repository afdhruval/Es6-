const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['student_registered', 'teacher_registered', 'course_created', 'enrollment', 'course_completed', 'teacher_approved', 'teacher_rejected'],
    required: true
  },
  message: { type: String, required: true },
  icon: { type: String, default: 'fa-bell' },
  color: { type: String, default: 'blue' },
  relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
