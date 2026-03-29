import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateBookingForm, formatTime, formatCurrency } from '../utils/helpers';

const EMPTY_FORM = {
  userName: '',
  email: '',
  phone: '',
  seats: '1',
};

const BookingPage = () => {
  const { busId } = useParams();
  const { getBusById, createBooking } = useApp();
  const navigate = useNavigate();

  const bus = getBusById(busId);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  if (!bus) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <p>Bus not found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/buses')}>
            Back to Buses
          </button>
        </div>
      </div>
    );
  }

  if (bus.availableSeats === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">😔</div>
          <p>This bus is fully booked.</p>
          <button className="btn btn-primary" onClick={() => navigate('/buses')}>
            View Other Buses
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const seats = Math.max(1, parseInt(form.seats) || 1);
  const totalAmount = bus.price * seats;

  const handleSubmit = () => {
    const errs = validateBookingForm(form, bus.availableSeats);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = createBooking(busId, { ...form, seats });
      setLoading(false);
      if (result.success) {
        setSuccess(result.booking);
      } else {
        setErrors({ seats: result.message });
      }
    }, 500);
  };

  // Success screen
  if (success) {
    return (
      <div className="page">
        <div className="success-screen">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Booking Confirmed!</h2>
          <p className="success-sub">Your ticket has been booked successfully.</p>

          <div className="ticket-card">
            <div className="ticket-header">
              <span className="ticket-bus">{success.busName}</span>
              <span className="ticket-id">#{success.id.slice(-6).toUpperCase()}</span>
            </div>
            <div className="ticket-route">
              <div className="ticket-city">
                <div className="tc-label">FROM</div>
                <div className="tc-value">{success.source}</div>
              </div>
              <div className="ticket-arrow">✈</div>
              <div className="ticket-city tc-right">
                <div className="tc-label">TO</div>
                <div className="tc-value">{success.destination}</div>
              </div>
            </div>
            <div className="ticket-details">
              <div className="td-item">
                <span>Passenger</span>
                <span>{success.userName}</span>
              </div>
              <div className="td-item">
                <span>Departure</span>
                <span>{formatTime(success.departureTime)}</span>
              </div>
              <div className="td-item">
                <span>Seats</span>
                <span>{success.seats}</span>
              </div>
              <div className="td-item td-total">
                <span>Total Paid</span>
                <span>{formatCurrency(success.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/buses')}>
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Book Your Seat</h1>
          <p className="page-subtitle">Complete your booking details below</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="booking-layout">
        {/* Bus Summary */}
        <div className="booking-summary-card">
          <h3 className="summary-title">Trip Summary</h3>
          <div className="summary-bus-name">{bus.busName}</div>
          <div className="summary-bus-num">{bus.busNumber}</div>

          <div className="summary-route">
            <div className="sr-point">
              <span className="sr-dot dot-start" />
              <div>
                <div className="sr-city">{bus.source}</div>
                <div className="sr-time">{formatTime(bus.departureTime)}</div>
              </div>
            </div>
            <div className="sr-line" />
            <div className="sr-point">
              <span className="sr-dot dot-end" />
              <div>
                <div className="sr-city">{bus.destination}</div>
                <div className="sr-time">Arrival varies</div>
              </div>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-price-row">
            <span>Price per seat</span>
            <span>{formatCurrency(bus.price)}</span>
          </div>
          <div className="summary-price-row">
            <span>Seats selected</span>
            <span>{seats}</span>
          </div>
          <div className="summary-price-row summary-total">
            <span>Total Amount</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <div className="summary-seats-left">
            <span className={bus.availableSeats <= 5 ? 'seats-low' : ''}>
              ⚡ {bus.availableSeats} seat(s) remaining
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="form-card">
          <div className="form-section">
            <h2 className="form-section-title">👤 Passenger Details</h2>
            <div className="form-grid-2">
              <div className="form-group form-group-full">
                <label className="form-label">Full Name *</label>
                <input
                  name="userName"
                  className={`form-input ${errors.userName ? 'input-error' : ''}`}
                  placeholder="Enter passenger name"
                  value={form.userName}
                  onChange={handleChange}
                />
                {errors.userName && <span className="error-msg">{errors.userName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  Number of Seats * (max: {bus.availableSeats})
                </label>
                <input
                  type="number"
                  name="seats"
                  min="1"
                  max={bus.availableSeats}
                  className={`form-input ${errors.seats ? 'input-error' : ''}`}
                  value={form.seats}
                  onChange={handleChange}
                />
                {errors.seats && <span className="error-msg">{errors.seats}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing…' : `Confirm Booking — ${formatCurrency(totalAmount)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
