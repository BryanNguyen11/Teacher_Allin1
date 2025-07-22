import React, { useState } from 'react';
import '../Table.css';

// Make columns unique for React keys
const rawColumns = [
  'Full name', 'Code', 'User name', 'Khối', 'Status', 'Role', 'CR45', '15%', 'TP', '20%', 'Completion rate', '20%', 'Chỉ số chậm/ không hoàn thành DL', '20%', 'Điểm trung bình chuyên môn', '25%', 'Technical', 'Trial', 'Sư phạm', 'Điểm đánh giá (Max = 5)', 'Xếp loại', 'Đánh giá'
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
      <div className="responsive-table-container" style={{boxShadow: '0 4px 32px 0 rgba(0,0,0,0.06), 0 1.5px 8px 0 rgba(80,80,80,0.04)'}}>
        <table className="responsive-table">
          <thead>
            <tr>
              {columns.map(colKey => <th key={colKey} style={{background:'#fff', color:'#222', borderBottom:'2.5px solid #444', fontWeight:800, letterSpacing:0.5, textTransform:'uppercase'}}>{colKeyMap[colKey]}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={columns.length} style={{textAlign: 'center', color: '#444', fontWeight:700, background:'#f8f8f8', letterSpacing:0.5}}>Không tìm thấy giáo viên với CODE này.</td></tr>
            ) : (
              filtered.map((row, idx) => (
                <tr key={idx} style={{background:'#fff'}}>
                  {columns.map(colKey => {
                    const col = colKeyMap[colKey];
                    const is3T = row[col] && typeof row[col] === 'string' && row[col].trim() === '3T' && highlightCols.includes(col);
                    return (
                      <td
                        key={colKey}
                        style={{
                          color:'#222',
                          fontWeight: col==='Full name'||col==='Code'||col==='User name' ? 700 : 400,
                          background: is3T ? '#ffd6d6' : undefined,
                          border: is3T ? '2px solid #d00' : undefined,
                          transition: 'background 0.2s, border 0.2s'
                        }}
                      >{row[col]}</td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
