import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { bookings } = useApp();
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🚌</span>
          <span className="brand-text">BusGo</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            Home
          </NavLink>
          <NavLink to="/buses" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Buses
          </NavLink>
          <NavLink to="/buses/new" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            + Add Bus
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            My Bookings
            {confirmedCount > 0 && (
              <span className="badge">{confirmedCount}</span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
