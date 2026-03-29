// ─── localStorage Keys ────────────────────────────────────────────────────────
export const KEYS = {
  BUSES: 'busgo_buses',
  BOOKINGS: 'busgo_bookings',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getItem = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write error:', e);
  }
};
