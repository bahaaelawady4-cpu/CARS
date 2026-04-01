const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
