import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import BusList from './pages/BusList';
import AddEditBus from './pages/AddEditBus';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';

const AppShell = () => {
  const { toast } = useApp();
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/buses/new" element={<AddEditBus />} />
          <Route path="/buses/edit/:id" element={<AddEditBus />} />
          <Route path="/book/:busId" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route
            path="*"
            element={
              <div className="page">
                <div className="empty-state">
                  <div className="empty-icon">🗺️</div>
                  <p>Page not found.</p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Toast toast={toast} />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default App;
