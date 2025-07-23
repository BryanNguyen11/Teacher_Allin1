// keepAwake.js
// Tự động gửi request đến server backend mỗi 50s để giữ cho server Render không bị sleep.

const API_BASE = process.env.REACT_APP_API_BASE || 'https://teacher-allin1.onrender.com';

function keepServerAwake() {
  setInterval(() => {
    fetch(`${API_BASE}/api/csv/files`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        // Optional: log to console for debugging
        // console.log('Keep awake ping sent', data);
      })
      .catch(() => {
        // console.warn('Keep awake ping failed');
      });
  }, 50000); // 50s
}

export default keepServerAwake;
