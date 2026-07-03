const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: null },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
  price: { type: Number, default: 0 },
  duration: { type: String, default: '' }, // e.g. "10 hours"
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  totalStudents: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
