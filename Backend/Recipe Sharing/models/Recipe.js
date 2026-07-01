const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true, 
  },
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1495195134817-a165d42e27e8?auto=format&fit=crop&q=80&w=1000', // Default food image
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usersssss',
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },   
  ],
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
