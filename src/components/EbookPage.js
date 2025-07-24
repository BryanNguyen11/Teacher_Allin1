import React, { useState, useEffect, useRef } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://teacher-allin1.onrender.com';

const EbookPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedEbook, setSelectedEbook] = useState(null);
  const fileInputRef = useRef();

  // Fetch ebook list from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/ebook/list`)
      .then(res => res.json())
      .then(data => setEbooks(Array.isArray(data) ? data : []))
      .catch(() => setEbooks([]));
  }, [uploadSuccess]);

  // Handle upload
  const handleUpload = async () => {
    if (!file || !title) {
      setUploadError('Vui lòng nhập tên tài liệu và chọn file PDF!');
      return;
    }
    if (password !== '191103') {
      setUploadError('Sai mật khẩu!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    try {
      const res = await fetch(`${API_BASE}/api/ebook/upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Lỗi upload');
      setUploadSuccess('Tải lên thành công!');
      setUploadError('');
      setShowUpload(false);
      setPassword('');
      setTitle('');
      setFile(null);
      fileInputRef.current.value = '';
      setTimeout(() => setUploadSuccess(''), 2000);
    } catch {
      setUploadError('Lỗi upload lên server!');
      setUploadSuccess('');
    }
  };

  return (
    <div style={{width:'100%', minHeight:'80vh', background:'#fff', padding:'16px 0', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h2 style={{fontWeight:800, fontSize:'1.5rem', color:'#1976d2', marginBottom:18, letterSpacing:1, textAlign:'center'}}>Ebook - Tài liệu PDF</h2>
      <div style={{maxWidth:900, width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', gap:16}}>
        <div style={{display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', justifyContent:'space-between'}}>
          <span style={{fontWeight:700, fontSize:16}}>Danh sách tài liệu:</span>
          <button onClick={()=>setShowUpload(v=>!v)} style={{padding:'8px 18px', borderRadius:8, background:'#1976d2', color:'#fff', fontWeight:700, border:'none', fontSize:15, cursor:'pointer'}}>Tải lên tài liệu mới</button>
        </div>
        {showUpload && (
          <div style={{display:'flex', flexDirection:'column', gap:8, background:'#f8fafd', borderRadius:10, padding:16, boxShadow:'0 2px 8px #e0e0e033', maxWidth:400, margin:'0 auto'}}>
            <input type="password" placeholder="Nhập mật khẩu" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:'8px 12px', borderRadius:6, border:'1.5px solid #e0e0e0', fontSize:15}} />
            <input type="text" placeholder="Tên tài liệu" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:'8px 12px', borderRadius:6, border:'1.5px solid #e0e0e0', fontSize:15}} />
            <input type="file" accept="application/pdf" ref={fileInputRef} onChange={e=>setFile(e.target.files[0])} style={{padding:'8px 0'}} />
            <button onClick={handleUpload} style={{padding:'8px 18px', borderRadius:8, background:'#1976d2', color:'#fff', fontWeight:700, border:'none', fontSize:15, cursor:'pointer'}}>Tải lên</button>
            {uploadError && <span style={{color:'#b00', fontWeight:600}}>{uploadError}</span>}
            {uploadSuccess && <span style={{color:'#0a0', fontWeight:600}}>{uploadSuccess}</span>}
          </div>
        )}
        <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:8}}>
          {ebooks.length === 0 && <span style={{color:'#888'}}>Chưa có tài liệu nào.</span>}
          {ebooks.map((ebook, idx) => (
            <div key={ebook._id || idx} style={{display:'flex', alignItems:'center', gap:10, background:'#f5f6fa', borderRadius:8, padding:'10px 14px', boxShadow:'0 2px 8px #e0e0e033', cursor:'pointer'}} onClick={()=>setSelectedEbook(ebook)}>
              <span style={{fontWeight:700, color:'#1976d2', flex:1}}>{ebook.title || 'Tài liệu PDF'}</span>
              <span style={{color:'#1976d2', fontWeight:600, fontSize:14}}>Xem</span>
            </div>
          ))}
        </div>
        {selectedEbook && (
          <div style={{marginTop:18, width:'100%', maxWidth:900, background:'#fff', borderRadius:12, boxShadow:'0 2px 16px #e0e0e033', padding:12, display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:8}}>
              <span style={{fontWeight:700, fontSize:16, color:'#1976d2'}}>{selectedEbook.title}</span>
              <button onClick={()=>setSelectedEbook(null)} style={{background:'none', border:'none', color:'#b00', fontWeight:700, fontSize:16, cursor:'pointer'}}>Đóng</button>
            </div>
            <iframe
              src={selectedEbook.url}
              title={selectedEbook.title}
              style={{width:'100%', minHeight:400, height:'60vh', border:'1.5px solid #e0e0e0', borderRadius:8, background:'#fff'}}
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookPage;
