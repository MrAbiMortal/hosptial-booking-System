require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paramananda_clinic');
  await Doctor.updateOne(
    { registrationNo: 'TN-PAED-0001' }, // replace with real reg no.
    { $setOnInsert: {
        name: 'Dr. A. Arulkumaran', qualification: 'M.D., (Paed)', specialization: 'Child Health Specialist (Paediatrician)',
        registrationNo: 'TN-PAED-0001', phone: '9443073997', email: 'arulkumaran@example.com',
        clinicName: 'Paramananda Clinic', fee: 300,
        availableDays: [1, 2, 3, 4, 5, 6], startTime: '10:00', endTime: '13:00', slotMinutes: 15 } },
    { upsert: true });
  console.log('Seeded'); process.exit(0);
})();
