import express from 'express';
import multer from 'multer';
import { uploadCsv, getCsvFiles } from '../controllers/csvController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCsv);
router.get('/files', getCsvFiles);

export default router;
