import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BusCard from '../components/BusCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'seats', label: 'Most Seats' },
];

const BusList = () => {
  const { buses } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid'); // 'grid' | 'table'

  const busTypes = [...new Set(buses.map((b) => b.busType))];

  const filtered = buses
    .filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        b.busName.toLowerCase().includes(q) ||
        b.busNumber.toLowerCase().includes(q) ||
        b.source.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q);
      const matchType = !filterType || b.busType === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'seats') return b.availableSeats - a.availableSeats;
      return 0; // newest = insertion order
    });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Buses</h1>
          <p className="page-subtitle">{buses.length} buses in the system</p>
        </div>
        <Link to="/buses/new" className="btn btn-primary">
          + Add New Bus
        </Link>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="filter-search"
          placeholder="Search by name, number, route…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {busTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="view-toggle">
          <button
            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${view === 'table' ? 'active' : ''}`}
            onClick={() => setView('table')}
            title="Table view"
          >
            ≡
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚌</div>
          <p>No buses match your filters.</p>
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setFilterType(''); }}>
            Clear Filters
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="bus-grid">
          {filtered.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus Name</th>
                <th>Number</th>
                <th>Route</th>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bus) => (
                <tr key={bus.id} className={bus.availableSeats === 0 ? 'row-full' : ''}>
                  <td className="td-bold">{bus.busName}</td>
                  <td className="td-mono">{bus.busNumber}</td>
                  <td>{bus.source} → {bus.destination}</td>
                  <td>{bus.departureTime}</td>
                  <td><span className="tag tag-sm">{bus.busType}</span></td>
                  <td>₹{bus.price}</td>
                  <td>
                    <span className={bus.availableSeats <= 5 ? 'seats-low' : ''}>
                      {bus.availableSeats}/{bus.totalSeats}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/book/${bus.id}`} className="btn btn-primary btn-xs" style={bus.availableSeats === 0 ? {pointerEvents:'none',opacity:0.4} : {}}>
                        Book
                      </Link>
                      <Link to={`/buses/edit/${bus.id}`} className="btn btn-outline btn-xs">
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusList;
