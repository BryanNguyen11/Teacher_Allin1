import React, { useState } from 'react';
import '../Table.css';

// Make columns unique for React keys
const rawColumns = [
  'Full name', 'Mã LMS' , 'Khối', 'Status', 'Role', 'CR45', '15%', 'TP', '20%', 'Completion rate', '20%', 'Chỉ số chậm/ không hoàn thành DL', '20%', 'Điểm trung bình chuyên môn', '25%', 'Technical', 'Trial', 'Sư phạm', 'Điểm đánh giá (Max = 5)', 'Xếp loại', 'Đánh giá'
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
  const tableData = Array.isArray(data) && data.length > 0 ? data : defaultData;
  const filtered = query.trim()
    ? tableData.filter(row => row['Code'] && row['Code'].toLowerCase() === query.trim().toLowerCase())
    : [];

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
          // Xác định màu viền và hiệu ứng theo Rank
          const rank = (row['Rank'] || '').toUpperCase();
          let borderColor = '#e0e0e0';
          let boxShadow = '0 2px 16px 0 rgba(80,80,80,0.10)';
          let gradient = '';
          let sparkle = false;
          if (rank.startsWith('T')) {
            const num = parseInt(rank.slice(1), 10);
            if (!isNaN(num)) {
              if (num === 0) { borderColor = '#888'; boxShadow = '0 0 12px 0 #8882'; } // Sắt
              else if (num <= 2) { borderColor = '#b87333'; boxShadow = '0 0 12px 0 #b8733344'; } // Đồng
              else if (num <= 4) { borderColor = '#aaa'; boxShadow = '0 0 12px 0 #aaa6'; } // Bạc
              else if (num <= 7) { borderColor = '#ffd700'; boxShadow = '0 0 12px 0 #ffd70055'; } // Vàng
              else if (num <= 12) { borderColor = '#50fa7b'; boxShadow = '0 0 12px 0 #50fa7b55'; } // Lục bảo
              else if (num <= 16) { borderColor = '#b9f2ff'; boxShadow = '0 0 12px 0 #b9f2ff55'; } // Bạch kim
              else if (num <= 20) { borderColor = '#00bfff'; boxShadow = '0 0 12px 0 #00bfff55'; } // Kim cương
              if (num >= 5) {
                // Từ T5 trở lên: gradient + sparkle
                gradient = 'linear-gradient(120deg, #ffd700, #50fa7b, #b9f2ff, #00bfff)';
                sparkle = true;
              }
            }
          }
          return (
            <div key={idx}
              style={{
                background: gradient ? gradient : '#fff',
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
                animation: sparkle ? 'sparkle 1.8s linear infinite' : undefined
              }}>
              {/* Hiệu ứng sparkle overlay */}
              {sparkle && (
                <span style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  pointerEvents: 'none',
                  background: 'repeating-linear-gradient(120deg,rgba(255,255,255,0.18) 0 2px,transparent 2px 8px)',
                  zIndex: 1,
                  animation: 'shine 2.2s linear infinite'
                }} />
              )}
              <div style={{position:'relative', zIndex:2}}>
              {columns.map(colKey => {
                const col = colKeyMap[colKey];
                // Map dữ liệu 'Mã LMS' sang 'Code' nếu cần
                let value = row[col];
                if (col === 'Mã LMS' && !value && row['Code']) value = row['Code'];
                const is3T = value && typeof value === 'string' && value.trim() === '3T' && highlightCols.includes(col);
                return (
                  <div key={colKey} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontWeight: col==='Full name'||col==='Mã LMS' ? 700 : 400,
                    background: is3T ? '#ffd6d6' : undefined,
                    border: is3T ? '2px solid #d00' : undefined,
                    borderRadius: 8,
                    padding: '6px 0',
                    fontSize: 16
                  }}>
                    <span style={{minWidth: 120, color:'#555'}}>{colKeyMap[colKey]}:</span>
                    <span style={{color:'#222'}}>{value}</span>
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
