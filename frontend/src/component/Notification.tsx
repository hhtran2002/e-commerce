import React, { useEffect } from 'react';
import '../style/Notification.css';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' ; // loại thông báo
  onClose: () => void;
  duration?: number; // thời gian tự ẩn (ms)
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;