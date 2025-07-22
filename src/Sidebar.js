import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar-glass">
      <div className="sidebar-title">Teacher AI1</div>
      <ul className="sidebar-menu">
        <li className="active"><span>Chỉ số giáo viên</span></li>
        <li><span>Chức năng 2</span></li>
        <li><span>Chức năng 3</span></li>
        {/* Thêm các mục khác ở đây */}
      </ul>
    </nav>
  );
};

export default Sidebar;
