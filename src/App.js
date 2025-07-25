


import React, { useState, useRef, useEffect } from 'react';
import keepServerAwake from './keepAwake';
import Table from './components/Table';
import CalendarPage from './components/CalendarPage';
import Sidebar from './components/Sidebar';
import EbookPage from './components/EbookPage';
import NotificationsPage, { ToastNotification } from './components/NotificationsPage';
import './App.css';

// Sử dụng biến môi trường REACT_APP_API_BASE, fallback về render nếu không có
const API_BASE = process.env.REACT_APP_API_BASE || 'https://teacher-allin1.onrender.com';

function App() {
  const [loading, setLoading] = useState(true);
  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Gọi keepServerAwake để giữ server Render luôn thức
  useEffect(() => {
    keepServerAwake();
    // Loading screen effect
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);
  const [showSidebar, setShowSidebar] = useState(true);
  const [tableData, setTableData] = useState(null);
  const fileInputRef = useRef();
  const [showUpload, setShowUpload] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  // State để điều hướng trang ("dashboard" hoặc "calendar")
  const [page, setPage] = useState('dashboard');

  async function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(event) {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        setUploadError('File không hợp lệ!');
        setUploadSuccess('');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] || '');
        return obj;
      });
      // Gửi lên backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('rows', JSON.stringify(rows));
      try {
      const res = await fetch(`${API_BASE}/api/csv/upload`, {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Lỗi upload lên server');
        setUploadSuccess('Tải lên file thành công!');
        setUploadError('');
        setShowUpload(false);
        setPassword('');
        setTimeout(() => setUploadSuccess(''), 3000);
        // Sau khi upload thành công, fetch lại dữ liệu mới nhất
        fetchLatestCsv();
      } catch (err) {
        setUploadError('Lỗi upload lên server!');
        setUploadSuccess('');
      }
    };
    reader.readAsText(file);
  }

  // Hàm lấy dữ liệu csv mới nhất từ backend
  async function fetchLatestCsv() {
    try {
      const res = await fetch(`${API_BASE}/api/csv/files`);
      if (!res.ok) throw new Error('Lỗi lấy dữ liệu từ server');
      const files = await res.json();

      if (Array.isArray(files) && files.length > 0) {
        // Nếu files[0].data là mảng lồng mảng, lấy phần tử đầu tiên
        let tableRows = files[0].data;
        if (Array.isArray(tableRows) && tableRows.length === 1 && Array.isArray(tableRows[0])) {
          tableRows = tableRows[0];
        }

        setTableData(tableRows);
      }
    } catch (err) {
      setUploadError('Không thể lấy dữ liệu từ server!');
    }
  }

  // Lấy dữ liệu khi load trang
  useEffect(() => {
    fetchLatestCsv();
    // eslint-disable-next-line
  }, []);

  // Compute columns that have at least one '3T' (except excluded columns) to highlight
  let highlightCols = [];
  if (
    tableData &&
    Array.isArray(tableData) &&
    tableData.length > 0 &&
    tableData.some(row => Object.values(row).some(v => v && v.trim && v.trim() !== ''))
  ) {
    const headers = Object.keys(tableData[0]);
    const excludedCols = ['Điểm trung bình chuyên môn'];
    highlightCols = headers.filter(col => {
      if (excludedCols.includes(col.trim())) return false;
      return tableData.some(row => typeof row[col] === 'string' && row[col].trim() === '3T');
    });
  }

  if (loading) {
    return (
      <div style={{
        background: '#fff',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999
      }}>
        <img
          src="/logomindx13.jpg"
          alt="logo"
          style={{
            width: 90,
            height: 90,
            borderRadius: 16,
            boxShadow: '0 4px 32px #e0e0e0',
            background: '#fff',
            objectFit: 'contain',
            animation: 'popupLogo 1.2s cubic-bezier(.18,.89,.32,1.28)'
          }}
        />
        <style>{`
          @keyframes popupLogo {
            0% { opacity: 0; transform: scale(0.5); }
            60% { opacity: 1; transform: scale(1.08); }
            80% { transform: scale(0.96); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // Sau khi loading xong, trả về giao diện chính
  return (
    <div>
      {/* Sidebar, Header, Main content, ToastNotification, ... */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} setPage={setPage} />
      <div className="main-content">
        {/* Header branding */}
        <header style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', background: '#fff', boxShadow: '0 2px 8px #f0f0f0' }}>
          <img src="/logomindx13.jpg" alt="logo" style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }} />
          <h1 style={{ fontWeight: 700, fontSize: 22, color: '#1a1a1a', margin: 0 }}>MINDX AIO</h1>
        </header>
        {/* Main page content */}
        {page === 'dashboard' && (
          <Table
            tableData={tableData}
            highlightCols={highlightCols}
            fileInputRef={fileInputRef}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
            password={password}
            setPassword={setPassword}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            handleCSVUpload={handleCSVUpload}
          />
        )}
        {page === 'calendar' && <CalendarPage />}
        {page === 'ebook' && <EbookPage setToast={setToast} />}
        {page === 'notifications' && <NotificationsPage setToast={setToast} />}
      </div>
      {/* Toast notification */}
      <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );

  // ...existing code...
}

export default App;
