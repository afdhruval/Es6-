import { useEffect, useState } from 'react';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const Toast = ({ toast }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type} ${visible ? 'toast-show' : ''}`}>
      <span className="toast-icon">{ICONS[toast.type] || '✓'}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};

export default Toast;
