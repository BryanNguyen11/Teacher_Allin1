import React from 'react';
import '../Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar-modern">
      <ul className="sidebar-modern-menu">
        <li className="active"><span>Chỉ số giáo viên</span></li>
        <li><span>Chức năng 2</span></li>
        <li><span>Chức năng 3</span></li>
      </ul>
    </nav>
  );
};
// Responsive CSS cho sidebar (có thể thêm vào file Sidebar.css nếu tách riêng)
//
// @media (max-width: 900px) {
//   .sidebar {
//     width: 60px !important;
//     min-width: 60px !important;
//     font-size: 0.9rem;
//   }
//   .sidebar .sidebar-item {
//     padding: 8px 6px;
//     font-size: 0.9rem;
//   }
// }
//
// @media (max-width: 600px) {
//   .sidebar {
//     width: 44px !important;
//     min-width: 44px !important;
//     font-size: 0.8rem;
//   }
//   .sidebar .sidebar-item {
//     padding: 6px 4px;
//     font-size: 0.8rem;
//   }
// }

export default Sidebar;
