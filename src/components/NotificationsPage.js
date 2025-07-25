
import React, { useState, useEffect } from 'react';

const NOTI_URL = 'https://cxohok12.gitbook.io/quy-trinh-quy-dinh-danh-cho-giao-vien/ii.-thong-bao-moi';

// Toast notification component
export function ToastNotification({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose && onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 9999,
      background: type === 'success' ? '#43e97b' : '#e53935',
      color: '#fff',
      padding: '14px 28px',
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 17,
      boxShadow: '0 2px 16px #2222',
      minWidth: 180,
      textAlign: 'center',
      letterSpacing: 0.5,
      transition: 'all 0.3s',
      opacity: 0.98
    }}>
      {message}
    </div>
  );
}

const NotificationsPage = () => {
  // Demo: Toast notification state (có thể dùng context cho toàn app)
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Ví dụ: Gọi setToast({message: 'Thao tác thành công!', type: 'success'}) khi cần

  return (
    <div style={{padding: 24}}>
      <h2 style={{marginBottom: 24}}>Thông báo mới dành cho giáo viên</h2>
      <iframe
        src={NOTI_URL}
        title="Thông báo giáo viên MindX"
        style={{width: '100%', minHeight: '70vh', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff'}}
        allowFullScreen
      />
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: toast.type })}
      />
    </div>
  );
};

export default NotificationsPage;
