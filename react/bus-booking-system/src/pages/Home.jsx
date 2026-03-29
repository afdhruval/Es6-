import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BusCard from '../components/BusCard';

const Home = () => {
  const { buses } = useApp();
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  const cities = [...new Set(buses.flatMap((b) => [b.source, b.destination]))].sort();

  const handleSearch = () => {
    setSearched(true);
    const filtered = buses.filter((b) => {
      const srcMatch = !source || b.source.toLowerCase().includes(source.toLowerCase());
      const dstMatch = !destination || b.destination.toLowerCase().includes(destination.toLowerCase());
      return srcMatch && dstMatch;
    });
    setResults(filtered);
  };

  const handleClear = () => {
    setSource('');
    setDestination('');
    setSearched(false);
    setResults([]);
  };

  const stats = {
    total: buses.length,
    available: buses.filter((b) => b.availableSeats > 0).length,
    totalSeats: buses.reduce((s, b) => s + b.availableSeats, 0),
  };

  const featuredBuses = buses.filter((b) => b.availableSeats > 0).slice(0, 3);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">🚌 Real-time Seat Availability</div>
          <h1 className="hero-title">
            Your Journey,<br />
            <span className="gradient-text">Our Buses.</span>
          </h1>
          <p className="hero-subtitle">
            Book comfortable bus seats instantly. Manage your trips with ease.
          </p>

          {/* Search Box */}
          <div className="search-box">
            <div className="search-fields">
              <div className="search-field">
                <label>From</label>
                <input
                  list="src-cities"
                  className="search-input"
                  placeholder="Source city"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                <datalist id="src-cities">
                  {cities.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <span className="search-swap">⇄</span>
              <div className="search-field">
                <label>To</label>
                <input
                  list="dst-cities"
                  className="search-input"
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <datalist id="dst-cities">
                  {cities.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>
            <div className="search-actions">
              <button className="btn btn-primary btn-lg" onClick={handleSearch}>
                Search Buses
              </button>
              {searched && (
                <button className="btn btn-ghost btn-lg" onClick={handleClear}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Buses</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.available}</span>
            <span className="stat-label">Available Now</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalSeats}</span>
            <span className="stat-label">Open Seats</span>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="section">
          <h2 className="section-title">
            Search Results
            <span className="section-count">{results.length} found</span>
          </h2>
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No buses found for this route.</p>
              <button className="btn btn-outline" onClick={() => navigate('/buses')}>
                View All Buses
              </button>
            </div>
          ) : (
            <div className="bus-grid">
              {results.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured Buses */}
      {!searched && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Available Buses</h2>
            <button className="btn btn-ghost" onClick={() => navigate('/buses')}>
              View All →
            </button>
          </div>
          <div className="bus-grid">
            {featuredBuses.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
          {featuredBuses.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🚌</div>
              <p>No buses available. Add some!</p>
              <button className="btn btn-primary" onClick={() => navigate('/buses/new')}>
                + Add Bus
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
