const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  qualification: { type: String, required: [true, 'Qualification is required'], trim: true },
  specialization: { type: String, required: [true, 'Specialization is required'], trim: true },
  registrationNo: { type: String, required: [true, 'Registration number is required'], unique: true, trim: true },
  phone: { type: String, required: [true, 'Phone is required'], match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  clinicName: { type: String, default: 'Paramananda Clinic', trim: true },
  address: { type: String, trim: true },
  fee: { type: Number, default: 0, min: 0 },
  availableDays: { type: [{ type: Number, min: 0, max: 6 }], default: [1, 2, 3, 4, 5, 6] },
  startTime: { type: String, required: true, default: '09:00', match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:mm time'] },
  endTime: { type: String, required: true, default: '13:00', match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:mm time'] },
  slotMinutes: { type: Number, default: 15, enum: [10, 15, 20, 30] }
}, { timestamps: true });

doctorSchema.pre('validate', function () {
  if (this.startTime >= this.endTime) {
    this.invalidate('endTime', 'End time must be after start time');
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
