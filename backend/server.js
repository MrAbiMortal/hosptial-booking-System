require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let databaseConnection;
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!databaseConnection) {
    const mongoUri = process.env.MONGO_URI || (process.env.VERCEL ? '' : 'mongodb://127.0.0.1:27017/paramananda_clinic');
    if (!mongoUri) throw new Error('MONGO_URI must be configured in the deployment environment');
    databaseConnection = mongoose.connect(mongoUri).catch(error => {
      databaseConnection = undefined;
      throw error;
    });
  }
  await databaseConnection;
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', (req, res, next) => connectToDatabase().then(() => next(), next));
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
if (require.main === module) {
  connectToDatabase()
    .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
    .catch(err => { console.error('Mongo connection failed:', err.message); process.exit(1); });
}

module.exports = app;
