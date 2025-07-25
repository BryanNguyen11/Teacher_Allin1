const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const NOTI_URL = 'https://cxohok12.gitbook.io/quy-trinh-quy-dinh-danh-cho-giao-vien/ii.-thong-bao-moi';

app.get('/api/notifications', async (req, res) => {
  try {
    const response = await fetch(NOTI_URL);
    const html = await response.text();
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy dữ liệu thông báo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
