import CsvFile from '../models/CsvFile.js';

export const uploadCsv = async (req, res) => {
  try {
    let { rows } = req.body;
    if (!req.file || !rows) {
      return res.status(400).json({ error: 'Thiếu file hoặc dữ liệu.' });
    }
    // Nếu rows là string (do gửi qua form-data), parse lại thành mảng object
    if (typeof rows === 'string') {
      try {
        rows = JSON.parse(rows);
      } catch (e) {
        return res.status(400).json({ error: 'Dữ liệu rows không hợp lệ.' });
      }
    }
    if (!Array.isArray(rows)) {
      return res.status(400).json({ error: 'Dữ liệu rows không phải mảng.' });
    }
    const csv = new CsvFile({
      filename: req.file.filename,
      originalname: req.file.originalname,
      data: rows, // Lưu đúng là mảng các object
    });
    await csv.save();
    res.status(201).json({ message: 'Tải lên thành công!', id: csv._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCsvFiles = async (req, res) => {
  try {
    const files = await CsvFile.find().sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
