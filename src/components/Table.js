import React, { useState, useEffect } from 'react';
import '../Table.css';

// Make columns unique for React keys
const rawColumns = [
  'Full name', 'Mã LMS' , 'Khối', 'Status', 'Role', 'CR45',  'TP',  'Completion rate',  'Chỉ số chậm/ không hoàn thành DL', 'Điểm trung bình chuyên môn', 'Technical', 'Trial', 'Sư phạm', 'Điểm đánh giá (Max = 5)', 'Xếp loại', 'Đánh giá'
];
const columns = (() => {
  const count = {};
  return rawColumns.map(col => {
    count[col] = (count[col] || 0) + 1;
    return count[col] > 1 ? `${col}_${count[col]}` : col;
  });
})();
// Map for display name to unique key
const colKeyMap = (() => {
  const count = {};
  const map = {};
  rawColumns.forEach(col => {
    count[col] = (count[col] || 0) + 1;
    map[`${col}_${count[col]}`] = col;
    if (count[col] === 1) map[col] = col;
  });
  return map;
})();

const defaultData = [
  {
    'Full name': 'Phạm Tuấn Đạt',
    'Code': 'datpt1',
    'User name': 'datpt1',
    'Rank': 'T1',
    'Khối': 'X-Art',
    'Status': 'Active',
    'Role': 'LEC',
    'CR45': '22.22%',
    '15%': '3.00',
    'TP': '0.00',
    '20%': '0',
    'Completion rate': '96.67%',
    'Chỉ số chậm/ không hoàn thành DL': '5.00',
    '20%': '0',
    'Điểm trung bình chuyên môn': '5',
    '25%': '3T',
    'Technical': '0',
    'Trial': '3T',
    'Sư phạm': '3T',
    'Điểm đánh giá (Max = 5)': '2.45',
    'Xếp loại': 'TP level 2-',
    'Đánh giá': 'Chưa đánh giá'
  }
];

const Table = ({ data, highlightCols = [] }) => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [shimmerPos, setShimmerPos] = useState(0);
  const [popAnim, setPopAnim] = useState(false);
  const tableData = Array.isArray(data) && data.length > 0 ? data : defaultData;
  const filtered = query.trim()
    ? tableData.filter(row => row['Code'] && row['Code'].toLowerCase() === query.trim().toLowerCase())
    : [];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShimmerPos(pos => (pos + 4) % 200); // move shimmer (chậm hơn 10 lần)
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hiệu ứng pop up khi tìm kiếm
  useEffect(() => {
    if (filtered.length > 0 && query.trim()) {
      setPopAnim(true);
      const t = setTimeout(() => setPopAnim(false), 600);
      return () => clearTimeout(t);
    }
  }, [query]);

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 16, gap: 8}}>
        <input
          type="text"
          placeholder="Nhập Mã LMS của bạn"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') setQuery(search); }}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: filtered.length === 0 && query.trim() ? '2px solid #444' : '2px solid #e0e0e0',
            fontSize: 17,
            minWidth: 240,
            outline: 'none',
            boxShadow: filtered.length === 0 && query.trim()
              ? '0 2px 12px 0 rgba(80,80,80,0.10)'
              : '0 2px 12px 0 rgba(0,0,0,0.06)',
            background: '#fff',
            color: '#222',
            fontWeight: 500,
            transition: 'all 0.2s',
            borderColor: filtered.length === 0 && query.trim() ? '#444' : '#e0e0e0',
          }}
        />
        <button
          onClick={() => setQuery(search)}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#444',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px 0 rgba(80,80,80,0.08)',
            transition: 'background 0.2s',
            marginLeft: 4
          }}
        >Tìm kiếm</button>
      </div>
      {filtered.length === 0 ? (
        <div style={{textAlign: 'center', color: '#444', fontWeight:700, background:'#f8f8f8', letterSpacing:0.5, padding: 32, borderRadius: 12, margin: '0 auto', maxWidth: 400}}>
          Không tìm thấy giáo viên với CODE này.
        </div>
      ) : (
        filtered.map((row, idx) => {
          // Xác định màu viền và hiệu ứng metallic shimmer theo Rank
          const rank = (row['Rank'] || '').toUpperCase();
          let borderColor = '#e0e0e0';
          let boxShadow = '0 2px 16px 0 rgba(80,80,80,0.10)';
          let metallicColors = '';
          let metallicAnim = false;
          let rarityBg = '#fff';
          if (rank.startsWith('T')) {
            const num = parseInt(rank.slice(1), 10);
            if (!isNaN(num)) {
              // Thang màu sắc độ hiếm vật phẩm game:
              // 0: xám (common), 1-2: xanh lá (uncommon), 3-4: xanh dương (rare), 5-7: tím (epic), 8-12: cam (legendary), 13-16: vàng (mythic), 17-20: đỏ (immortal)
              if (num === 0) {
                borderColor = '#888'; boxShadow = '0 0 12px 0 #8882';
                metallicColors = '#b0b0b0,#e0e0e0,#888';
                rarityBg = 'linear-gradient(120deg,#b0b0b0 0%,#e0e0e0 100%)'; // xám
              } else if (num <= 2) {
                borderColor = '#43e97b'; boxShadow = '0 0 12px 0 #43e97b44';
                metallicColors = '#43e97b,#38f9d7,#e0ffe0';
                rarityBg = 'linear-gradient(120deg,#43e97b 0%,#38f9d7 100%)'; // xanh lá
              } else if (num <= 4) {
                borderColor = '#3a8dde'; boxShadow = '0 0 12px 0 #3a8dde44';
                metallicColors = '#3a8dde,#6dd5fa,#e0f7ff';
                rarityBg = 'linear-gradient(120deg,#3a8dde 0%,#6dd5fa 100%)'; // xanh dương
              } else if (num <= 7) {
                borderColor = '#a259e6'; boxShadow = '0 0 12px 0 #a259e644';
                metallicColors = '#a259e6,#fbc2eb,#e0e0ff';
                rarityBg = 'linear-gradient(120deg,#a259e6 0%,#fbc2eb 100%)'; // tím
              } else if (num <= 12) {
                borderColor = '#ff9800'; boxShadow = '0 0 12px 0 #ff980044';
                metallicColors = '#ff9800,#ffc371,#fff3e0';
                rarityBg = 'linear-gradient(120deg,#ff9800 0%,#ffc371 100%)'; // cam
              } else if (num <= 16) {
                borderColor = '#ffd700'; boxShadow = '0 0 12px 0 #ffd70044';
                metallicColors = '#ffd700,#fffbe0,#fff';
                rarityBg = 'linear-gradient(120deg,#ffd700 0%,#fffbe0 100%)'; // vàng
              } else if (num <= 20) {
                borderColor = '#ff1744'; boxShadow = '0 0 12px 0 #ff174444';
                metallicColors = '#ff1744,#ff616f,#fff';
                rarityBg = 'linear-gradient(120deg,#ff1744 0%,#ff616f 100%)'; // đỏ
              }
              metallicAnim = true;
            }
          }
          return (
            <div key={idx}
              style={{
                background: metallicAnim ? rarityBg : '#fff',
                borderRadius: 16,
                boxShadow,
                margin: '0 auto 24px',
                maxWidth: 480,
                padding: 24,
                border: `2.5px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                overflow: 'hidden',
                backgroundSize: metallicAnim ? '200% 200%' : undefined,
                backgroundPosition: metallicAnim ? `${shimmerPos}% 50%` : undefined,
                transition: metallicAnim ? 'background-position 0.7s cubic-bezier(.4,1.6,.6,1)' : undefined,
                transform: popAnim ? 'scale(1.06)' : 'scale(1)',
                opacity: popAnim ? 1 : 0.96,
                animation: popAnim ? 'popupCard 0.85s cubic-bezier(.18,.89,.32,1.28) both' : undefined
              }}>
              {/* Hiệu ứng metallic shimmer overlay */}
              {metallicAnim && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 1,
                    background: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      width: '100%', height: '100%',
                      background: 'linear-gradient(120deg, rgba(255,255,255,0.00) 45%, rgba(255,255,255,0.45) 48%, rgba(255,255,255,0.45) 52%, rgba(255,255,255,0.00) 55%)',
                      transform: `translate(${shimmerPos - 100}%, ${shimmerPos - 100}%)`,
                      transition: 'transform 2s cubic-bezier(.4,1.6,.6,1)',
                      pointerEvents: 'none',
                      zIndex: 2,
                      willChange: 'transform',
                    }}
                  />
                </span>
              )}
              <div style={{position:'relative', zIndex:2}}>
              {columns.map(colKey => {
                const col = colKeyMap[colKey];
                // Map dữ liệu 'Mã LMS' sang 'Code' nếu cần
                let value = row[col];
                if (col === 'Mã LMS' && !value && row['Code']) value = row['Code'];
                const is3T = value && typeof value === 'string' && value.trim() === '3T' && highlightCols.includes(col);
                // Badge style cho Status, Role
                const isBadge = col === 'Status' || col === 'Role';
                return (
                  <div key={colKey} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    background: is3T ? 'linear-gradient(90deg,#ff5858 0%,#ffb347 100%)' : undefined,
                    border: is3T ? '3px solid #d00' : undefined,
                    borderRadius: 10,
                    padding: '8px 0',
                    fontSize: 16,
                    margin: '0 0 2px 0',
                    boxShadow: undefined,
                    position: 'relative',
                    overflow: is3T ? 'visible' : undefined,
                    zIndex: is3T ? 3 : undefined,
                    width: is3T ? '105%' : undefined,
                    marginLeft: is3T ? '-2.5%' : undefined
                  }}>
                    <span style={{
                      minWidth: 120,
                      color: is3T ? '#fff' : '#333',
                      fontWeight: 700,
                      letterSpacing: 0.2,
                      textAlign: 'left',
                      flex: 1,
                      textShadow: is3T ? '0 2px 8px #d00, 0 0 2px #fff' : undefined,
                      marginLeft: is3T ? 12 : undefined
                    }}>{colKeyMap[colKey]}:</span>
                    <span style={{
                      color: is3T ? '#fff' : (isBadge ? '#fff' : '#222'),
                      fontWeight: is3T ? 800 : (isBadge ? 700 : 500),
                      background: isBadge ? (col === 'Status' ? (value === 'Active' ? 'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)' : 'linear-gradient(90deg,#ff5858 0%,#f09819 100%)') : 'linear-gradient(90deg,#667eea 0%,#764ba2 100%)') : undefined,
                      borderRadius: isBadge ? '999px' : undefined,
                      padding: is3T ? 0 : (isBadge ? '2px 12px' : undefined),
                      boxShadow: isBadge ? '0 2px 8px 0 rgba(80,80,80,0.10)' : undefined,
                      border: isBadge ? '1.5px solid #eee' : undefined,
                      marginLeft: isBadge ? 8 : undefined,
                      marginRight: is3T ? 12 : undefined,
                      fontSize: is3T ? 16 : (isBadge ? 15 : 16),
                      letterSpacing: isBadge ? 0.5 : undefined,
                      transition: 'all 0.2s',
                      textAlign: isBadge ? 'center' : (is3T ? 'center' : 'right'),
                      display: isBadge ? 'inline-block' : (is3T ? 'inline' : 'block'),
                      minWidth: isBadge ? 36 : undefined,
                      maxWidth: isBadge ? 120 : undefined,
                      whiteSpace: isBadge ? 'nowrap' : undefined,
                      position: 'relative',
                      zIndex: 4,
                      textShadow: is3T ? '0 2px 8px #d00, 0 0 2px #fff' : undefined
                    }}>{value}</span>
                  </div>
                );
              })}
              </div>
            </div>
          );
        })
// Thêm animation CSS vào file Table.css hoặc global
// @keyframes sparkle {
//   0% { filter: brightness(1); }
//   50% { filter: brightness(1.25); }
//   100% { filter: brightness(1); }
// }
// @keyframes shine {
//   0% { background-position: -200px 0; }
//   100% { background-position: 200px 0; }
// }
      )}
    </div>
  );
};

export default Table;
