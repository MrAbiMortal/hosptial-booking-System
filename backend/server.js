require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    const msg = fields.includes('slot') || fields.includes('date')
      ? 'This slot is already booked. Please choose another.'
      : `${fields.includes('email') ? 'Email' : fields.includes('registrationNo') ? 'Registration number' : 'Value'} already exists.`;
    return res.status(409).json({ message: msg });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier or value' });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paramananda_clinic')
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch(err => { console.error('Mongo connection failed:', err.message); process.exit(1); });
