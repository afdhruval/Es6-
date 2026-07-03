const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true, default: '' },
  avatar: { type: String, default: null },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  bio: { type: String, default: '' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }],
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('Student', studentSchema);
