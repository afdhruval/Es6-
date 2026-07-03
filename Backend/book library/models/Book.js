const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please provide an ISBN'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  coverImage: {
    type: String,
    default: 'default-book.png'
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please provide the total number of copies'],
    min: 0
  },
  availableCopies: {
    type: Number,
    min: 0
  }
}, { timestamps: true });

// Pre-save middleware to set available copies if not provided initially
bookSchema.pre('save', function(next) {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
