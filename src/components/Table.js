import React, { useState, useEffect } from 'react';
import '../Table.css';

// Make columns unique for React keys
const rawColumns = [
  'Full name', 'Mã LMS' , 'Khối', 'Status', 'Role', 'CR45',  'TP',  'Completion rate',  'Chỉ số chậm/ không hoàn thành DL', 'Điểm trung bình chuyên môn', 'Technical', 'Trial', 'Sư phạm', 'Điểm đánh giá (Max = 5)', 'Xếp loại', 'Đánh giá', 'Mức Handle'
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
  // Hologram animation tick (must be outside map callback)
  const [holoTick, setHoloTick] = useState(0);
  useEffect(() => {
    let frame;
    const animate = () => {
      setHoloTick(t => t + 1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  // Hook để lưu kích thước màn hình
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Theo dõi sự thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Xác định nếu đang ở mobile view
  const isMobile = windowWidth < 576;
  const isTablet = windowWidth >= 576 && windowWidth < 992;
  
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

  // Bảng mapping Rank -> Mức Handle
  const handleByRank = {
    'T0': '1 - 5',
    'T1': '6',
    'T2': '7',
    'T3': '8',
    'T4': '9',
    'T5': '9',
    'T6': '10',
    'T7': '10',
    'T8': '10',
    'T9': '10',
    'T10': '10',
    'T11': '11',
    'T12': '11',
    'T13': '11',
    'T14': '12',
    'T15': '12',
    'T16': '13',
    'T17': '13',
    'T18': '14',
    'T19': '14',
    'T20': '15'
  };
  // State for upload
  const [showUpload, setShowUpload] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = React.useRef();

  // Dummy upload handler (replace with real if needed)
  const handleCSVUpload = e => {
    // ...implement upload logic or call parent handler
    setUploadSuccess('Tải lên thành công!');
    setTimeout(() => setUploadSuccess(''), 2000);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 0, margin: 0 }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
        boxShadow: '0 2px 16px 0 rgba(80,80,80,0.10)',
        background: '#fff',
        borderRadius: 12,
        padding: 16,
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
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
            minWidth: 120,
            flex: 1,
            outline: 'none',
            boxShadow: '0 2px 12px 0 rgba(80,80,80,0.10)',
            background: '#fff',
            color: '#222',
            fontWeight: 500,
            transition: 'all 0.2s',
            borderColor: filtered.length === 0 && query.trim() ? '#444' : '#e0e0e0',
            maxWidth: 220
          }}
        />
        <button
          onClick={() => setQuery(search)}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#e53935',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px 0 rgba(229,57,53,0.12)',
            transition: 'all 0.18s cubic-bezier(.4,1.6,.6,1)',
            marginLeft: 4,
            outline: 'none',
            position: 'relative',
            overflow: 'hidden',
            userSelect: 'none',
            background: search ? 'linear-gradient(90deg,#e53935 60%,#b71c1c 100%)' : '#e53935',
            boxShadow: search ? '0 4px 16px 0 #e5393533' : '0 2px 8px 0 rgba(229,57,53,0.12)',
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'scale(0.96)';
            e.currentTarget.style.background = 'linear-gradient(90deg,#b71c1c 60%,#e53935 100%)';
            e.currentTarget.style.boxShadow = '0 2px 8px 0 #b71c1c44';
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'linear-gradient(90deg,#e53935 60%,#b71c1c 100%)';
            e.currentTarget.style.boxShadow = '0 4px 16px 0 #e5393533';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = '#e53935';
            e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(229,57,53,0.12)';
          }}
          onTouchStart={e => {
            e.currentTarget.style.transform = 'scale(0.96)';
            e.currentTarget.style.background = 'linear-gradient(90deg,#b71c1c 60%,#e53935 100%)';
            e.currentTarget.style.boxShadow = '0 2px 8px 0 #b71c1c44';
          }}
          onTouchEnd={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'linear-gradient(90deg,#e53935 60%,#b71c1c 100%)';
            e.currentTarget.style.boxShadow = '0 4px 16px 0 #e5393533';
          }}
        >Tìm kiếm</button>
        <button
          onClick={() => setShowUpload(v => !v)}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px 0 rgba(25,118,210,0.12)',
            transition: 'all 0.18s cubic-bezier(.4,1.6,.6,1)',
            marginLeft: 4,
            outline: 'none',
            position: 'relative',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >Tải lên CSV</button>
      </div>
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
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#444',
          fontWeight: 700,
          background: '#fff',
          letterSpacing: 0.5,
          padding: 32,
          borderRadius: 12,
          margin: '0 auto',
          maxWidth: 400,
          boxShadow: '0 2px 16px 0 rgba(80,80,80,0.10)',
        }}>
          Không tìm thấy giáo viên với mã LMS này.
        </div>
      ) : (
        filtered.map((row, idx) => {
          // Xác định màu viền và hiệu ứng metallic shimmer theo Rank
          const rank = (row['Rank'] || '').toUpperCase();
          // Determine handle level from mapping
          const handleByRankMap = {
            'T0': 1, 'T1': 2, 'T2': 3, 'T3': 4, 'T4': 5, 'T5': 6, 'T6': 7, 'T7': 8, 'T8': 9, 'T9': 10, 'T10': 11, 'T11': 12, 'T12': 13, 'T13': 14, 'T14': 15, 'T15': 16, 'T16': 17, 'T17': 18, 'T18': 19, 'T19': 20, 'T20': 21
          };
          const handleLevel = handleByRankMap[rank] || 0;
          let shimmerAnim = false;
          let rarityBg = '#fff';
          // Làm hiệu ứng gradient hologram mềm mại hơn: giảm biên độ, tăng hòa trộn, chuyển động chậm hơn, thêm blur
          // Gradient pastel tím-xanh-hồng, hiệu ứng hologram
          const stops = [
            { color: '#e3e6ef', pos: 0 },
            { color: 'rgba(186, 146, 255, 0.22)', pos: 14 + Math.abs(Math.sin((holoTick + idx*8)/60)) * 16 }, // Purple
            { color: 'rgba(173, 216, 230, 0.22)', pos: 28 + Math.abs(Math.cos((holoTick + idx*12)/72)) * 16 }, // Light Blue
            { color: 'rgba(255, 182, 193, 0.22)', pos: 44 + Math.abs(Math.sin((holoTick + idx*5)/54)) * 16 }, // Pink
            { color: 'rgba(144, 238, 255, 0.22)', pos: 60 + Math.abs(Math.cos((holoTick + idx*10)/60)) * 16 }, // Cyan
            { color: 'rgba(255, 255, 255, 0.18)', pos: 76 + Math.abs(Math.sin((holoTick + idx*7)/80)) * 10 }, // White
            { color: '#e3e6ef', pos: 100 }
          ];
          const gradientStr = stops.map(s => `${s.color} ${s.pos}%`).join(', ');
          rarityBg = `linear-gradient(115deg, ${gradientStr})`;
          // Loại bỏ viền thẻ, giữ bóng mượt
          // Trading card layout
          return (
            <div
              key={idx}
              style={{
                background: rarityBg,
                backgroundBlendMode: 'screen',
                borderRadius: 18,
                WebkitBorderRadius: 18,
                boxShadow: '0 8px 32px 0 #bfc9d6cc, 0 1.5px 8px 0 #b0e0ff33, 0 2px 16px 0 rgba(80,80,80,0.10)',
                margin: '0 auto 24px',
                maxWidth: 480,
                padding: 24,
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                position: 'relative',
                overflow: 'hidden',
                backgroundSize: '250% 250%',
                backgroundPosition: '50% 50%',
                transition: 'background 2.2s cubic-bezier(.4,1.6,.6,1)',
                transform: popAnim ? 'scale(1.04) translateY(-10px)' : 'scale(1) translateY(0)',
                opacity: popAnim ? 0.98 : 0.98,
                filter: 'blur(0.2px) brightness(1.08)',
                animation:
                  popAnim ? 'popupCardHolo 1.1s cubic-bezier(.18,.89,.32,1.28) both' : undefined
              }}
            >
              {/* Overlay noise lấp lánh */}
              <span style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none',
                zIndex: 1,
                opacity: 0.10,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/squairy-light.png")',
                mixBlendMode: 'screen',
              }} />
              {/* Header: Tên, Status (bỏ Rank) */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, zIndex:2}}>
                <div style={{fontWeight:800, fontSize:22, color:'#4b3ca7', letterSpacing:0.5}}>{row['Full name']}</div>
                <div style={{fontWeight:700, fontSize:15, color:'#fff', background:row['Status']==='Active'?'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)':'linear-gradient(90deg,#ff5858 0%,#f09819 100%)', borderRadius:12, padding:'4px 14px', boxShadow:'0 2px 8px 0 rgba(80,80,80,0.10)'}}>{row['Status']}</div>
              </div>
              {/* Divider */}
              <div style={{height:2, width:'100%', background:'linear-gradient(90deg,#b0e0ff 0%,#e3e6ef 100%)', opacity:0.5, margin:'8px 0 16px 0', borderRadius:2}} />
              {/* Main stats: TP, Điểm trung bình chuyên môn, Technical, Trial, Sư phạm */}
              <div style={{display:'flex', flexDirection: isMobile ? 'column' : 'column', gap:0, marginBottom:12, zIndex:2}}>
                {/* Nếu mobile: hiển thị từng chỉ số theo dạng dọc, còn lại giữ ngang */}
                {isMobile ? (
                  <div style={{display:'flex', flexDirection:'column', gap:10}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{fontWeight:700, fontSize:15, color:'#4b3ca7', minWidth:110}}>TP</div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 14px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['TP']}</div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{fontWeight:700, fontSize:15, color:'#4b3ca7', minWidth:110}}>Điểm chuyên môn</div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 14px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Điểm trung bình chuyên môn']}</div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{fontWeight:700, fontSize:15, color:'#4b3ca7', minWidth:110}}>Technical</div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 14px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Technical']}</div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{fontWeight:700, fontSize:15, color:'#4b3ca7', minWidth:110}}>Trial</div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 14px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Trial']}</div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{fontWeight:700, fontSize:15, color:'#4b3ca7', minWidth:110}}>Sư phạm</div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 14px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Sư phạm']}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Tên trường trên một dòng */}
                    <div style={{display:'flex', justifyContent:'space-between', gap:12, marginBottom:2}}>
                      <div style={{flex:1, fontWeight:700, fontSize:15, color:'#4b3ca7', textAlign:'center'}}>TP</div>
                      <div style={{flex:1, fontWeight:700, fontSize:15, color:'#4b3ca7', textAlign:'center'}}>Điểm chuyên môn</div>
                      <div style={{flex:1, fontWeight:700, fontSize:15, color:'#4b3ca7', textAlign:'center'}}>Technical</div>
                      <div style={{flex:1, fontWeight:700, fontSize:15, color:'#4b3ca7', textAlign:'center'}}>Trial</div>
                      <div style={{flex:1, fontWeight:700, fontSize:15, color:'#4b3ca7', textAlign:'center'}}>Sư phạm</div>
                    </div>
                    {/* Giá trị nằm dưới, mỗi trường trong box riêng */}
                    <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['TP']}</div>
                      </div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Điểm trung bình chuyên môn']}</div>
                      </div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Technical']}</div>
                      </div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Trial']}</div>
                      </div>
                      <div style={{flex:1, background:'rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 8px', textAlign:'center', boxShadow:'0 2px 8px 0 #b0e0ff22'}}>
                        <div style={{fontWeight:800, fontSize:20, color:'#222'}}>{row['Sư phạm']}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Divider */}
              <div style={{height:2, width:'100%', background:'linear-gradient(90deg,#b0e0ff 0%,#e3e6ef 100%)', opacity:0.5, margin:'8px 0 16px 0', borderRadius:2}} />
              {/* Footer: Completion rate, Mức Handle, Đánh giá (nhỏ hơn, nằm trên 1 hàng) */}
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:2, gap:6, marginTop:8}}>
                <div style={{fontWeight:600, fontSize:13, color:'#4b3ca7', background:'rgba(255,255,255,0.13)', borderRadius:8, padding:'4px 10px', minWidth:90, textAlign:'center'}}>
                  Completion rate: <span style={{color:'#222', fontWeight:700}}>{row['Completion rate']}</span>
                </div>
                <div style={{fontWeight:600, fontSize:13, color:'#4b3ca7', background:'rgba(255,255,255,0.13)', borderRadius:8, padding:'4px 10px', minWidth:90, textAlign:'center'}}>
                  Mức Handle: <span style={{color:'#222', fontWeight:700}}>{handleByRank[row['Rank']] || ''}</span>
                </div>
                <div style={{fontWeight:600, fontSize:13, color:'#4b3ca7', background:'rgba(255,255,255,0.13)', borderRadius:8, padding:'4px 10px', minWidth:90, textAlign:'center'}}>
                  Đánh giá: <span style={{color:'#222', fontWeight:700}}>{row['Đánh giá']}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Table;
