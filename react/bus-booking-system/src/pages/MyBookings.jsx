import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingCard from '../components/BookingCard';

const MyBookings = () => {
  const { bookings } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all' | 'confirmed' | 'cancelled'
  const [search, setSearch] = useState('');

  const filtered = bookings.filter((b) => {
    const matchStatus =
      filter === 'all' ||
      b.status.toLowerCase() === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      b.userName.toLowerCase().includes(q) ||
      b.busName.toLowerCase().includes(q) ||
      b.source.toLowerCase().includes(q) ||
      b.destination.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            {confirmedCount} confirmed · {cancelledCount} cancelled
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/buses')}>
          + New Booking
        </button>
      </div>

      {/* Summary Cards */}
      <div className="booking-stats">
        <div className="bstat-card">
          <span className="bstat-num">{bookings.length}</span>
          <span className="bstat-label">Total Bookings</span>
        </div>
        <div className="bstat-card bstat-confirmed">
          <span className="bstat-num">{confirmedCount}</span>
          <span className="bstat-label">Confirmed</span>
        </div>
        <div className="bstat-card bstat-cancelled">
          <span className="bstat-num">{cancelledCount}</span>
          <span className="bstat-label">Cancelled</span>
        </div>
        <div className="bstat-card bstat-amount">
          <span className="bstat-num">
            ₹{bookings
              .filter((b) => b.status === 'Confirmed')
              .reduce((s, b) => s + b.totalAmount, 0)
              .toLocaleString('en-IN')}
          </span>
          <span className="bstat-label">Total Value</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="filter-search"
          placeholder="Search by name, bus, route, ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {['all', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <p>
            {bookings.length === 0
              ? 'You have no bookings yet.'
              : 'No bookings match your filters.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/buses')}>
            Book a Bus
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
