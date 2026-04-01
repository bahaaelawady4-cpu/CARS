const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1886, 'Invalid year'], // first car ever made
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: [String],   // stores the image URL or file path
      default: [],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model('Car', carSchema);
