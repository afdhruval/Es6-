import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateBusForm } from '../utils/helpers';

const BUS_TYPES = ['AC Sleeper', 'Non-AC Seater', 'Semi-Sleeper', 'Volvo AC'];

const EMPTY_FORM = {
  busName: '',
  busNumber: '',
  source: '',
  destination: '',
  departureTime: '',
  price: '',
  totalSeats: '',
  busType: '',
};

const AddEditBus = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { addBus, updateBus, getBusById } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const bus = getBusById(id);
      if (!bus) {
        navigate('/buses');
        return;
      }
      setForm({
        busName: bus.busName,
        busNumber: bus.busNumber,
        source: bus.source,
        destination: bus.destination,
        departureTime: bus.departureTime,
        price: String(bus.price),
        totalSeats: String(bus.totalSeats),
        busType: bus.busType,
      });
    }
  }, [id, isEdit, getBusById, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = () => {
    const errs = validateBusForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (isEdit) {
        updateBus(id, form);
      } else {
        addBus(form);
      }
      setLoading(false);
      navigate('/buses');
    }, 400);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Bus' : 'Add New Bus'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the details for this bus.' : 'Fill in the details to register a new bus.'}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/buses')}>
          ← Back
        </button>
      </div>

      <div className="form-card">
        <div className="form-section">
          <h2 className="form-section-title">🚌 Bus Information</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Bus Name *</label>
              <input
                name="busName"
                className={`form-input ${errors.busName ? 'input-error' : ''}`}
                placeholder="e.g. Patel Travels"
                value={form.busName}
                onChange={handleChange}
              />
              {errors.busName && <span className="error-msg">{errors.busName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Bus Number *</label>
              <input
                name="busNumber"
                className={`form-input ${errors.busNumber ? 'input-error' : ''}`}
                placeholder="e.g. GJ-01-AB-1234"
                value={form.busNumber}
                onChange={handleChange}
              />
              {errors.busNumber && <span className="error-msg">{errors.busNumber}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Bus Type *</label>
              <select
                name="busType"
                className={`form-input form-select ${errors.busType ? 'input-error' : ''}`}
                value={form.busType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                {BUS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.busType && <span className="error-msg">{errors.busType}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Departure Time *</label>
              <input
                type="time"
                name="departureTime"
                className={`form-input ${errors.departureTime ? 'input-error' : ''}`}
                value={form.departureTime}
                onChange={handleChange}
              />
              {errors.departureTime && <span className="error-msg">{errors.departureTime}</span>}
            </div>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-section">
          <h2 className="form-section-title">📍 Route Details</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Source City *</label>
              <input
                name="source"
                className={`form-input ${errors.source ? 'input-error' : ''}`}
                placeholder="e.g. Ahmedabad"
                value={form.source}
                onChange={handleChange}
              />
              {errors.source && <span className="error-msg">{errors.source}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Destination City *</label>
              <input
                name="destination"
                className={`form-input ${errors.destination ? 'input-error' : ''}`}
                placeholder="e.g. Mumbai"
                value={form.destination}
                onChange={handleChange}
              />
              {errors.destination && <span className="error-msg">{errors.destination}</span>}
            </div>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-section">
          <h2 className="form-section-title">💺 Pricing & Capacity</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Price per Seat (₹) *</label>
              <input
                type="number"
                name="price"
                min="1"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
                placeholder="e.g. 850"
                value={form.price}
                onChange={handleChange}
              />
              {errors.price && <span className="error-msg">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                Total Seats *{' '}
                {isEdit && <span className="label-hint">(existing bookings preserved)</span>}
              </label>
              <input
                type="number"
                name="totalSeats"
                min="1"
                max="100"
                className={`form-input ${errors.totalSeats ? 'input-error' : ''}`}
                placeholder="e.g. 40"
                value={form.totalSeats}
                onChange={handleChange}
              />
              {errors.totalSeats && <span className="error-msg">{errors.totalSeats}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/buses')}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving…' : isEdit ? 'Update Bus' : 'Add Bus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditBus;
