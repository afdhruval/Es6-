const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true, default: '' },
  avatar: { type: String, default: null },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  bio: { type: String, default: '' },
  specialization: { type: String, default: '' },
  earnings: { type: Number, default: 0 },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
