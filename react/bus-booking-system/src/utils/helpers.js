// ─── ID Generator ─────────────────────────────────────────────────────────────
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

// ─── Time Formatter: "14:30" → "2:30 PM" ─────────────────────────────────────
export const formatTime = (time) => {
  if (!time) return '—';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// ─── Currency Formatter ───────────────────────────────────────────────────────
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

// ─── Date Formatter ───────────────────────────────────────────────────────────
export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ─── Bus Form Validator ───────────────────────────────────────────────────────
export const validateBusForm = (data) => {
  const errors = {};
  if (!data.busName?.trim()) errors.busName = 'Bus name is required';
  if (!data.busNumber?.trim()) errors.busNumber = 'Bus number is required';
  if (!data.source?.trim()) errors.source = 'Source city is required';
  if (!data.destination?.trim()) errors.destination = 'Destination city is required';
  if (data.source?.trim().toLowerCase() === data.destination?.trim().toLowerCase())
    errors.destination = 'Source and destination cannot be the same';
  if (!data.departureTime) errors.departureTime = 'Departure time is required';
  if (!data.price || Number(data.price) <= 0) errors.price = 'Enter a valid price';
  if (!data.totalSeats || Number(data.totalSeats) < 1)
    errors.totalSeats = 'At least 1 seat is required';
  if (!data.busType?.trim()) errors.busType = 'Bus type is required';
  return errors;
};

// ─── Booking Form Validator ───────────────────────────────────────────────────
export const validateBookingForm = (data, maxSeats) => {
  const errors = {};
  if (!data.userName?.trim()) errors.userName = 'Full name is required';
  if (!data.phone?.trim()) errors.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(data.phone.trim())) errors.phone = 'Enter a valid 10-digit number';
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = 'Enter a valid email address';
  if (!data.seats || Number(data.seats) < 1) errors.seats = 'At least 1 seat required';
  else if (Number(data.seats) > maxSeats)
    errors.seats = `Only ${maxSeats} seat(s) available`;
  return errors;
};
