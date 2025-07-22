import mongoose from 'mongoose';

const CsvFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  data: { type: Array, required: true }, // Array of row objects
});

export default mongoose.model('CsvFile', CsvFileSchema);
