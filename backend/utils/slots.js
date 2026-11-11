const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const toStr = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function generateSlots(doctor, date) {
  if (!isValidDate(date)) return [];
  const day = new Date(date + 'T00:00:00').getDay();
  if (isPastDate(date) || !doctor.availableDays.includes(day)) return [];
  const slots = [];
  for (let t = toMin(doctor.startTime); t + doctor.slotMinutes <= toMin(doctor.endTime); t += doctor.slotMinutes) {
    slots.push(toStr(t));
  }
  return slots;
}

const isPastDate = date => {
  if (!isValidDate(date)) return true;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(date + 'T00:00:00') < today;
};

module.exports = { generateSlots, isPastDate, isValidDate };
