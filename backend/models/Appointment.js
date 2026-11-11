const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientName: { type: String, required: [true, 'Child name is required'], trim: true },
  age: { type: String, required: [true, 'Age is required'], trim: true },
  parentName: { type: String, required: [true, 'Parent name is required'], trim: true },
  phone: { type: String, required: [true, 'Phone is required'], match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'] },
  reason: { type: String, trim: true },
  date: { type: String, required: true, match: [/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD date'] },
  slot: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm time'] },
  bookingId: { type: Number, required: true, min: 1, max: 10000 },
  bookingDate: { type: String, required: true, match: [/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD date'] },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
}, { timestamps: true });

// Prevent double booking of the same slot
appointmentSchema.index(
  { doctor: 1, date: 1, slot: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
);

appointmentSchema.index(
  { bookingDate: 1, bookingId: 1 },
  { unique: true, partialFilterExpression: { bookingId: { $exists: true } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
