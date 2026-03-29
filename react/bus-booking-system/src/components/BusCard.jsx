import { Link, useNavigate } from 'react-router-dom';
import { formatTime, formatCurrency } from '../utils/helpers';
import { useApp } from '../context/AppContext';

const BusCard = ({ bus, showActions = true }) => {
  const { deleteBus } = useApp();
  const navigate = useNavigate();

  const occupancy = bus.totalSeats - bus.availableSeats;
  const occupancyPct = Math.round((occupancy / bus.totalSeats) * 100);
  const isFull = bus.availableSeats === 0;

  const handleDelete = () => {
    if (window.confirm(`Delete "${bus.busName}"? All bookings will be removed.`)) {
      deleteBus(bus.id);
    }
  };

  const typeColors = {
    'AC Sleeper': 'tag-blue',
    'Non-AC Seater': 'tag-gray',
    'Semi-Sleeper': 'tag-amber',
    'Volvo AC': 'tag-green',
  };

  return (
    <div className={`bus-card ${isFull ? 'bus-card-full' : ''}`}>
      {/* Header */}
      <div className="bus-card-header">
        <div>
          <h3 className="bus-name">{bus.busName}</h3>
          <span className="bus-number">{bus.busNumber}</span>
        </div>
        <span className={`tag ${typeColors[bus.busType] || 'tag-gray'}`}>
          {bus.busType}
        </span>
      </div>

      {/* Route */}
      <div className="bus-route">
        <div className="route-point">
          <span className="route-dot dot-start" />
          <div>
            <div className="route-city">{bus.source}</div>
            <div className="route-time">{formatTime(bus.departureTime)}</div>
          </div>
        </div>
        <div className="route-line">
          <span className="route-arrow">✈</span>
        </div>
        <div className="route-point route-point-end">
          <span className="route-dot dot-end" />
          <div>
            <div className="route-city">{bus.destination}</div>
            <div className="route-time">Arrival varies</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bus-stats">
        <div className="stat">
          <span className="stat-label">Price</span>
          <span className="stat-value price-value">{formatCurrency(bus.price)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Available</span>
          <span className={`stat-value ${bus.availableSeats <= 5 ? 'seats-low' : ''}`}>
            {bus.availableSeats}
            <span className="stat-sub"> / {bus.totalSeats}</span>
          </span>
        </div>
      </div>

      {/* Seat bar */}
      <div className="seat-bar-wrap">
        <div className="seat-bar">
          <div
            className="seat-bar-fill"
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
        <span className="seat-bar-label">{occupancyPct}% full</span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="bus-card-actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={isFull}
            onClick={() => navigate(`/book/${bus.id}`)}
          >
            {isFull ? 'Fully Booked' : 'Book Now'}
          </button>
          <Link to={`/buses/edit/${bus.id}`} className="btn btn-outline btn-sm">
            Edit
          </Link>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BusCard;
