const router = require('express').Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { generateSlots, isPastDate, isValidDate } = require('../utils/slots');
const { allocateBookingId, getClinicDate } = require('../utils/booking-id');

// Pre-book
router.post('/', async (req, res, next) => {
  try {
    const { doctor, date, slot } = req.body;
    const doc = await Doctor.findById(doctor);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    if (!isValidDate(date) || isPastDate(date)) return res.status(400).json({ message: 'Choose a valid upcoming date' });
    if (!generateSlots(doc, date).includes(slot)) return res.status(400).json({ message: 'Invalid slot for this doctor/date' });

    const bookingDate = getClinicDate();
    const appt = new Appointment({ ...req.body, status: 'booked', bookingDate, bookingId: 1 });
    await appt.validate();
    appt.bookingId = await allocateBookingId(bookingDate);
    await appt.save();
    res.status(201).json(await appt.populate('doctor', 'name clinicName address'));
  } catch (e) { next(e); }
});

// Lookup: GET /api/appointments?phone=...&date=...&doctor=...
router.get('/', async (req, res, next) => {
  try {
    const q = {};
    if (req.query.phone) q.phone = req.query.phone;
    if (req.query.date) q.date = req.query.date;
    if (req.query.doctor) q.doctor = req.query.doctor;
    res.json(await Appointment.find(q).populate('doctor', 'name clinicName').sort({ date: 1, slot: 1 }));
  } catch (e) { next(e); }
});

// Cancel
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const a = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!a) return res.status(404).json({ message: 'Appointment not found' });
    res.json(a);
  } catch (e) { next(e); }
});

module.exports = router;
