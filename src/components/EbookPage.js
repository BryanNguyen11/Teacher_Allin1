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
  // Lấy dữ liệu ebook từ mock API
  useEffect(() => {
    fetch('https://688236cf66a7eb81224ddbbf.mockapi.io/api/closebeta/documents')
      .then(res => res.json())
      .then(data => setEbooks(Array.isArray(data) ? data : []))
      .catch(() => setEbooks([]));
  }, [uploadSuccess]);

  // Handle upload link
  const [pdfUrl, setPdfUrl] = useState('');
  const handleUpload = async () => {
    if (!title || !pdfUrl) {
      setUploadError('Vui lòng nhập tên tài liệu và link PDF!');
      return;
    }
    if (password !== '191103') {
      setUploadError('Sai mật khẩu!');
      return;
    }
    try {
      const res = await fetch('https://688236cf66a7eb81224ddbbf.mockapi.io/api/closebeta/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url: pdfUrl })
      });
      if (!res.ok) throw new Error('Lỗi upload');
      setUploadSuccess('Tải lên thành công!');
      setUploadError('');
      setShowUpload(false);
      setPassword('');
      setTitle('');
      setPdfUrl('');
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
            <input type="text" placeholder="Link PDF (https://...)" value={pdfUrl} onChange={e=>setPdfUrl(e.target.value)} style={{padding:'8px 12px', borderRadius:6, border:'1.5px solid #e0e0e0', fontSize:15}} />
            <button onClick={handleUpload} style={{padding:'8px 18px', borderRadius:8, background:'#1976d2', color:'#fff', fontWeight:700, border:'none', fontSize:15, cursor:'pointer'}}>Tải lên</button>
            {uploadError && <span style={{color:'#b00', fontWeight:600}}>{uploadError}</span>}
            {uploadSuccess && <span style={{color:'#0a0', fontWeight:600}}>{uploadSuccess}</span>}
          </div>
        )}
        <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:8}}>
          {ebooks.length === 0 && <span style={{color:'#888'}}>Chưa có tài liệu nào.</span>}
        {ebooks.map((ebook, idx) => (
            <div key={ebook.id || ebook._id || idx} style={{display:'flex', alignItems:'center', gap:10, background:'#f5f6fa', borderRadius:8, padding:'10px 14px', boxShadow:'0 2px 8px #e0e0e033', cursor:'pointer'}}>
              <span style={{fontWeight:700, color:'#1976d2', flex:1, cursor:'pointer'}} onClick={()=>setSelectedEbook(ebook)}>{ebook.title || 'Tài liệu PDF'}</span>
              <span style={{color:'#1976d2', fontWeight:600, fontSize:14, cursor:'pointer'}} onClick={()=>setSelectedEbook(ebook)}>Xem</span>
      <DeleteEbookButton ebookId={ebook.id} onDeleted={()=>setUploadSuccess(Date.now())} />
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

// Nút xóa tài liệu, yêu cầu nhập mật khẩu
function DeleteEbookButton({ ebookId, onDeleted }) {
  const [show, setShow] = React.useState(false);
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const handleDelete = async () => {
    if (pw !== '191103') {
      setErr('Sai mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://688236cf66a7eb81224ddbbf.mockapi.io/api/closebeta/documents/${ebookId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Lỗi xóa');
      setShow(false);
      setPw('');
      setErr('');
      if (onDeleted) onDeleted();
    } catch {
      setErr('Lỗi xóa tài liệu!');
    }
    setLoading(false);
  };
  return show ? (
    <div style={{display:'flex', alignItems:'center', gap:4}}>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mật khẩu" style={{padding:'2px 6px', borderRadius:4, border:'1px solid #ccc', fontSize:13, width:80}} />
      <button onClick={handleDelete} disabled={loading} style={{background:'#b00', color:'#fff', border:'none', borderRadius:4, padding:'2px 8px', fontSize:13, fontWeight:700, cursor:'pointer'}}>Xóa</button>
      <button onClick={()=>setShow(false)} style={{background:'#eee', color:'#222', border:'none', borderRadius:4, padding:'2px 8px', fontSize:13, fontWeight:700, cursor:'pointer'}}>Hủy</button>
      {err && <span style={{color:'#b00', fontSize:12, marginLeft:4}}>{err}</span>}
    </div>
  ) : (
    <button onClick={()=>setShow(true)} style={{background:'#fff', color:'#b00', border:'1px solid #b00', borderRadius:4, padding:'2px 8px', fontSize:13, fontWeight:700, cursor:'pointer'}}>Xóa</button>
  );
}
