const express = require('express');
const router = express.Router();
const Ebook = require('../models/Ebook');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Lưu file PDF vào thư mục public/ebooks (tạo nếu chưa có)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../public/ebooks');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// GET /api/ebook/list
router.get('/list', async (req, res) => {
  try {
    const ebooks = await Ebook.find().sort({ createdAt: -1 });
    res.json(ebooks);
  } catch {
    res.status(500).json([]);
  }
});

// POST /api/ebook/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file || !title) return res.status(400).json({ error: 'Thiếu file hoặc tên tài liệu' });
    // Đường dẫn public để client truy cập
    const url = `/ebooks/${req.file.filename}`;
    const ebook = new Ebook({ title, url });
    await ebook.save();
    res.json({ success: true, ebook });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi upload' });
  }
});

module.exports = router;
