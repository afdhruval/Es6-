import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, KEYS } from '../utils/localStorage';
import { generateId } from '../utils/helpers';

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_BUSES = [
  {
    id: 'bus001',
    busName: 'Patel Travels',
    busNumber: 'GJ-01-AB-1234',
    source: 'Ahmedabad',
    destination: 'Mumbai',
    departureTime: '06:00',
    price: 850,
    totalSeats: 40,
    availableSeats: 28,
    busType: 'AC Sleeper',
  },
  {
    id: 'bus002',
    busName: 'Gujarat Express',
    busNumber: 'GJ-05-CD-5678',
    source: 'Surat',
    destination: 'Pune',
    departureTime: '22:30',
    price: 650,
    totalSeats: 45,
    availableSeats: 20,
    busType: 'Non-AC Seater',
  },
  {
    id: 'bus003',
    busName: 'Royal Cruiser',
    busNumber: 'GJ-08-EF-9012',
    source: 'Vadodara',
    destination: 'Delhi',
    departureTime: '19:00',
    price: 1200,
    totalSeats: 36,
    availableSeats: 10,
    busType: 'AC Sleeper',
  },
  {
    id: 'bus004',
    busName: 'Shyam Travels',
    busNumber: 'MH-12-GH-3456',
    source: 'Mumbai',
    destination: 'Goa',
    departureTime: '21:00',
    price: 900,
    totalSeats: 50,
    availableSeats: 35,
    busType: 'Semi-Sleeper',
  },
];

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);

  // Hydrate from localStorage (or use seed data)
  useEffect(() => {
    const savedBuses = getItem(KEYS.BUSES);
    const savedBookings = getItem(KEYS.BOOKINGS);
    setBuses(savedBuses ?? SEED_BUSES);
    setBookings(savedBookings ?? []);
  }, []);

  // Persist buses whenever they change
  useEffect(() => {
    setItem(KEYS.BUSES, buses);
  }, [buses]);

  // Persist bookings whenever they change
  useEffect(() => {
    setItem(KEYS.BOOKINGS, bookings);
  }, [bookings]);

  // ─── Toast ───────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Bus CRUD ────────────────────────────────────────────────────────────
  const addBus = useCallback(
    (formData) => {
      const seats = parseInt(formData.totalSeats);
      const newBus = {
        ...formData,
        id: generateId(),
        totalSeats: seats,
        availableSeats: seats,
        price: parseFloat(formData.price),
      };
      setBuses((prev) => [newBus, ...prev]);
      showToast('Bus added successfully!');
      return newBus;
    },
    [showToast]
  );

  const updateBus = useCallback(
    (id, formData) => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.id !== id) return bus;
          const newTotal = parseInt(formData.totalSeats);
          const bookedSeats = bus.totalSeats - bus.availableSeats;
          const newAvailable = Math.max(0, newTotal - bookedSeats);
          return {
            ...bus,
            ...formData,
            totalSeats: newTotal,
            availableSeats: newAvailable,
            price: parseFloat(formData.price),
          };
        })
      );
      showToast('Bus updated successfully!');
    },
    [showToast]
  );

  const deleteBus = useCallback(
    (id) => {
      setBuses((prev) => prev.filter((b) => b.id !== id));
      setBookings((prev) => prev.filter((b) => b.busId !== id));
      showToast('Bus deleted.', 'error');
    },
    [showToast]
  );

  const getBusById = useCallback((id) => buses.find((b) => b.id === id), [buses]);

  // ─── Booking CRUD ─────────────────────────────────────────────────────────
  const createBooking = useCallback(
    (busId, formData) => {
      const bus = buses.find((b) => b.id === busId);
      if (!bus) return { success: false, message: 'Bus not found.' };

      const seats = parseInt(formData.seats);
      if (bus.availableSeats < seats)
        return { success: false, message: `Only ${bus.availableSeats} seat(s) available.` };

      const newBooking = {
        ...formData,
        id: generateId(),
        busId,
        busName: bus.busName,
        busNumber: bus.busNumber,
        busType: bus.busType,
        source: bus.source,
        destination: bus.destination,
        departureTime: bus.departureTime,
        pricePerSeat: bus.price,
        seats,
        totalAmount: bus.price * seats,
        status: 'Confirmed',
        bookedAt: new Date().toISOString(),
      };

      setBookings((prev) => [newBooking, ...prev]);
      setBuses((prev) =>
        prev.map((b) =>
          b.id === busId ? { ...b, availableSeats: b.availableSeats - seats } : b
        )
      );
      showToast('Booking confirmed! 🎉');
      return { success: true, booking: newBooking };
    },
    [buses, showToast]
  );

  const updateBooking = useCallback(
    (id, updates) => {
      const booking = bookings.find((b) => b.id === id);
      if (!booking) return false;
      if (booking.status === 'Cancelled') {
        showToast('Cannot update a cancelled booking.', 'error');
        return false;
      }

      const oldSeats = booking.seats;
      const newSeats = parseInt(updates.seats);
      const diff = newSeats - oldSeats;

      if (diff > 0) {
        const bus = buses.find((b) => b.id === booking.busId);
        if (!bus || bus.availableSeats < diff) {
          showToast(`Only ${bus?.availableSeats ?? 0} extra seat(s) available.`, 'error');
          return false;
        }
        setBuses((prev) =>
          prev.map((b) =>
            b.id === booking.busId ? { ...b, availableSeats: b.availableSeats - diff } : b
          )
        );
      } else if (diff < 0) {
        setBuses((prev) =>
          prev.map((b) =>
            b.id === booking.busId
              ? { ...b, availableSeats: b.availableSeats + Math.abs(diff) }
              : b
          )
        );
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, ...updates, seats: newSeats, totalAmount: b.pricePerSeat * newSeats }
            : b
        )
      );
      showToast('Booking updated!');
      return true;
    },
    [bookings, buses, showToast]
  );

  const cancelBooking = useCallback(
    (id) => {
      const booking = bookings.find((b) => b.id === id);
      if (!booking || booking.status === 'Cancelled') return;

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );
      setBuses((prev) =>
        prev.map((b) =>
          b.id === booking.busId
            ? { ...b, availableSeats: b.availableSeats + booking.seats }
            : b
        )
      );
      showToast('Booking cancelled. Seats restored.', 'warning');
    },
    [bookings, showToast]
  );

  const deleteBooking = useCallback(
    (id) => {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      showToast('Booking removed.', 'error');
    },
    [showToast]
  );

  return (
    <AppContext.Provider
      value={{
        buses,
        bookings,
        toast,
        showToast,
        // Bus
        addBus,
        updateBus,
        deleteBus,
        getBusById,
        // Booking
        createBooking,
        updateBooking,
        cancelBooking,
        deleteBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};
