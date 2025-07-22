
import React, { useState } from 'react';
import './Table.css';

const columns = [
  'Full name', 'Code', 'User name', 'Rank', 'Khối', 'Status', 'Role', 'CR45', '15%', 'TP', '20%', 'Completion rate', '20%', 'Chỉ số chậm/ không hoàn thành DL', '20%', 'Điểm trung bình chuyên môn', '25%', 'Technical', 'Trial', 'Sư phạm', 'Điểm đánh giá (Max = 5)', 'Xếp loại', 'Đánh giá'
];

const Table = ({ data = [] }) => {
  // Log keys của object đầu tiên để xác định tên trường
  if (Array.isArray(data) && data.length > 0) {
    console.log('Các trường của object đầu tiên:', Object.keys(data[0]));
    console.log('Giá trị object đầu tiên:', data[0]);
  }
  const [searchCode, setSearchCode] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  // Khi người dùng nhập code và nhấn Enter hoặc click nút tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      setFilteredRows([]);
      return;
    }
    // Tìm kiếm code (không phân biệt hoa thường)
    const found = data.filter(row => (row['Code'] || '').toLowerCase() === searchCode.trim().toLowerCase());
    setFilteredRows(found);
  };

  return (
    <div className="responsive-table-container">
      <form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Nhập mã Code để tìm kiếm..."
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
          style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
        />
        <button type="submit" style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>Tìm kiếm</button>
      </form>
      <table className="responsive-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{textAlign: 'center', color: '#888'}}>Không có dữ liệu</td>
            </tr>
          ) : (
            filteredRows.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => <td key={col}>{row[col]}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
