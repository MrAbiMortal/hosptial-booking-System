const mongoose = require('mongoose');

const bookingCounterSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  sequence: { type: Number, required: true, default: 0, min: 0, max: 10000 }
});

module.exports = mongoose.model('BookingCounter', bookingCounterSchema);