import React from 'react';

// Giao diện Lịch với nhúng Google Calendar (iframe)
// Responsive: iframe sẽ co giãn theo màn hình, tối ưu cho mobile
const GOOGLE_CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/embed?src=vi.vietnamese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FHo_Chi_Minh';

const CalendarPage = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: '#fff',
      padding: '16px 0',
    }}>
      <h2 style={{
        fontWeight: 800,
        fontSize: '1.5rem',
        color: '#1976d2',
        marginBottom: 18,
        letterSpacing: 1,
        textAlign: 'center',
        textShadow: '0 2px 8px #e0e7ef'
      }}>
        Lịch hoạt động
      </h2>
      <div style={{
        width: '100%',
        maxWidth: 900,
        minHeight: 500,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 16px 0 rgba(80,80,80,0.10)',
        background: '#f8fafd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <iframe
          title="Google Calendar"
          src={GOOGLE_CALENDAR_EMBED_URL}
          style={{
            border: 0,
            width: '100%',
            minHeight: 500,
            height: '60vh',
            maxHeight: 700,
            background: '#fff',
          }}
          allowFullScreen
        />
      </div>
      <div style={{fontSize: 14, color: '#888', marginTop: 12, textAlign: 'center'}}>
        * Nếu không hiển thị được lịch, hãy kiểm tra kết nối mạng hoặc thử trình duyệt khác.
      </div>
    </div>
  );
};

export default CalendarPage;
