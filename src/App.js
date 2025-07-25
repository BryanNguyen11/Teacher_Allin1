


import React, { useState, useRef, useEffect } from 'react';
import keepServerAwake from './keepAwake';
import Table from './components/Table';
import CalendarPage from './components/CalendarPage';
import Sidebar from './components/Sidebar';
import EbookPage from './components/EbookPage';
import './App.css';

// Sử dụng biến môi trường REACT_APP_API_BASE, fallback về render nếu không có
const API_BASE = process.env.REACT_APP_API_BASE || 'https://teacher-allin1.onrender.com';

function App() {

  // Gọi keepServerAwake để giữ server Render luôn thức
  useEffect(() => {
    keepServerAwake();
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

  return (
    <div className="App" style={{
      background:'#fff',
      minHeight:'100vh',
      display:'flex',
      width: '100vw',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      {showSidebar && <Sidebar onNavigate={setPage} />}
      <div
        className="main-content"
        style={{
          marginLeft: showSidebar ? 180 : 0,
          transition: 'margin-left 0.3s',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}
      >
        <header className="modern-header" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff',
          boxShadow: '0 2px 16px 0 rgba(80,80,80,0.08)',
          padding: '0 16px',
          minHeight: 44,
          height: 48,
          borderBottom: '1.5px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <img src="/logoMindx.png" alt="logo" style={{width:32, height:32, borderRadius:8, boxShadow:'0 2px 8px #e0e0e0', background:'#fff', objectFit:'contain', padding:2}} />
            <span style={{fontWeight:800, fontSize: '1.1rem', color:'#222', letterSpacing:1}}>Teacher AI1</span>
          </div>
          <button
            onClick={() => setShowSidebar(v => !v)}
            style={{
              background: '#f5f6fa',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              fontWeight: 700,
              fontSize: 18,
              
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(80,80,80,0.06)',
              transition: 'background 0.2s',
              marginLeft: 8,
              marginRight: 60
            }}
            aria-label={showSidebar ? 'Ẩn menu' : 'Hiện menu'}
          >
            <span style={{fontSize:20, fontWeight:900}}>{showSidebar ? '☰' : '☰'}</span>
          </button>
        </header>
        {showUpload && (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:12, margin:'16px 0'}}>
            <input
              type="password"
              placeholder="Nhập mật khẩu để tải lên"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{padding:'8px 16px', borderRadius:8, border:'1.5px solid #e0e0e0', fontSize:16, minWidth:220}}
            />
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{display:'block'}}
              disabled={password !== 'mindx2025'}
              onChange={handleCSVUpload}
            />
            {password !== 'mindx2025' && <span style={{color:'#b00', fontWeight:600}}>Nhập đúng mật khẩu để tải lên!</span>}
            {uploadError && <span style={{color:'#b00', fontWeight:600}}>{uploadError}</span>}
            {uploadSuccess && <span style={{color:'#0a0', fontWeight:600}}>{uploadSuccess}</span>}
          </div>
        )}
        <main>
          {page === 'dashboard' && (
            <>
              <h2 style={{marginTop: 32, marginBottom: 24, color: '#222', textAlign: 'center', letterSpacing: 1, fontWeight: 700, textShadow: '0 2px 8px #e0e7ef'}}>Bảng Chỉ Số Giáo Viên</h2>
              <Table data={tableData} highlightCols={highlightCols} />
            </>
          )}
          {page === 'calendar' && (
            <CalendarPage />
          )}
          {page === 'ebook' && (
            <EbookPage />
          )}
        </main>
        <footer style={{
          width: '100%',
          background: '#111',
          color: '#fff',
          textAlign: 'center',
          padding: '18px 8px 18px 8px',
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: 1,
          marginTop: 32,
          zIndex: 5
        }}>
          © {new Date().getFullYear()} Quyền sáng tạo và sở hữu thuộc về HCM03
        </footer>
      </div>
    </div>
  );
}

export default App;
