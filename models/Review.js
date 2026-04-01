const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: 'Car',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
