import { useState } from 'react';
import { formatTime, formatCurrency, formatDate } from '../utils/helpers';
import { useApp } from '../context/AppContext';

const BookingCard = ({ booking }) => {
  const { cancelBooking, deleteBooking, updateBooking } = useApp();
  const [editing, setEditing] = useState(false);
  const [editSeats, setEditSeats] = useState(booking.seats);
  const [editName, setEditName] = useState(booking.userName);
  const [editPhone, setEditPhone] = useState(booking.phone);
  const [editEmail, setEditEmail] = useState(booking.email);
  const [error, setError] = useState('');

  const isCancelled = booking.status === 'Cancelled';

  const handleUpdate = () => {
    setError('');
    if (!editName.trim()) return setError('Name is required.');
    if (!editPhone.trim() || !/^\d{10}$/.test(editPhone.trim()))
      return setError('Enter a valid 10-digit phone.');
    if (Number(editSeats) < 1) return setError('At least 1 seat required.');

    const ok = updateBooking(booking.id, {
      userName: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      seats: Number(editSeats),
    });
    if (ok !== false) setEditing(false);
  };

  return (
    <div className={`booking-card ${isCancelled ? 'booking-cancelled' : ''}`}>
      {/* Status badge */}
      <div className="booking-card-header">
        <div>
          <h3 className="booking-bus-name">{booking.busName}</h3>
          <span className="booking-id">#{booking.id.slice(-6).toUpperCase()}</span>
        </div>
        <span className={`status-badge ${isCancelled ? 'status-cancelled' : 'status-confirmed'}`}>
          {booking.status}
        </span>
      </div>

      {/* Route */}
      <div className="booking-route">
        <span className="booking-city">{booking.source}</span>
        <span className="booking-arrow">→</span>
        <span className="booking-city">{booking.destination}</span>
        <span className="booking-time">at {formatTime(booking.departureTime)}</span>
      </div>

      {/* Details or Edit form */}
      {editing ? (
        <div className="edit-form">
          {error && <div className="form-error-inline">{error}</div>}
          <div className="edit-row">
            <div className="form-group">
              <label>Passenger Name</label>
              <input
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-input"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="edit-row">
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Seats</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={editSeats}
                onChange={(e) => setEditSeats(e.target.value)}
              />
            </div>
          </div>
          <div className="edit-actions">
            <button className="btn btn-primary btn-sm" onClick={handleUpdate}>
              Save Changes
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setError(''); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="booking-details">
          <div className="booking-info-grid">
            <div className="booking-info-item">
              <span className="info-label">Passenger</span>
              <span className="info-value">{booking.userName}</span>
            </div>
            <div className="booking-info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{booking.phone}</span>
            </div>
            <div className="booking-info-item">
              <span className="info-label">Seats</span>
              <span className="info-value">{booking.seats}</span>
            </div>
            <div className="booking-info-item">
              <span className="info-label">Total</span>
              <span className="info-value amount-value">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
          <div className="booking-date">Booked on {formatDate(booking.bookedAt)}</div>
        </div>
      )}

      {/* Actions */}
      {!editing && (
        <div className="booking-actions">
          {!isCancelled && (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  if (window.confirm('Cancel this booking?')) cancelBooking(booking.id);
                }}
              >
                Cancel Booking
              </button>
            </>
          )}
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm('Remove this booking record?')) deleteBooking(booking.id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
