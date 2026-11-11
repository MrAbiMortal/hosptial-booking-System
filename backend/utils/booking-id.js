const BookingCounter = require('../models/BookingCounter');

const DAILY_BOOKING_LIMIT = 10000;

function getClinicDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

async function allocateBookingId(date) {
  const filter = { date, sequence: { $lt: DAILY_BOOKING_LIMIT } };
  const options = { new: true, upsert: true, setDefaultsOnInsert: true };
  let counter;

  try {
    counter = await BookingCounter.findOneAndUpdate(filter, { $inc: { sequence: 1 } }, options);
  } catch (error) {
    if (error.code !== 11000) throw error;
    counter = await BookingCounter.findOneAndUpdate(
      filter,
      { $inc: { sequence: 1 } },
      { new: true }
    );
  }

  if (!counter) {
    const error = new Error('The daily booking ID limit has been reached. Please try again tomorrow.');
    error.status = 409;
    throw error;
  }

  return counter.sequence;
}

module.exports = { allocateBookingId, getClinicDate };