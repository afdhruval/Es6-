const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'fa-book' },
  color: { type: String, default: '#6366f1' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
