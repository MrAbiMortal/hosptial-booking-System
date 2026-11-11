const router = require('express').Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { generateSlots, isPastDate, isValidDate } = require('../utils/slots');

// Register doctor
router.post('/', async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (e) { next(e); }
});

// List doctors
router.get('/', async (req, res, next) => {
  try { res.json(await Doctor.find().sort({ name: 1 })); } catch (e) { next(e); }
});

// Single doctor
router.get('/:id', async (req, res, next) => {
  try {
    const d = await Doctor.findById(req.params.id);
    if (!d) return res.status(404).json({ message: 'Doctor not found' });
    res.json(d);
  } catch (e) { next(e); }
});

// Available slots for a date: GET /api/doctors/:id/slots?date=YYYY-MM-DD
router.get('/:id/slots', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!isValidDate(date)) return res.status(400).json({ message: 'A valid date=YYYY-MM-DD is required' });
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (isPastDate(date)) return res.json([]);

    const all = generateSlots(doctor, date);
    const booked = await Appointment.find({ doctor: doctor._id, date, status: 'booked' }).select('slot');
    const taken = new Set(booked.map(b => b.slot));
    res.json(all.map(time => ({ time, available: !taken.has(time) })));
  } catch (e) { next(e); }
});

module.exports = router;
