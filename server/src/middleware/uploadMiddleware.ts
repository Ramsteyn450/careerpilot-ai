import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { UPLOAD_DIR, MAX_FILE_SIZE } from '../config/constants';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/octet-stream' // Some OS/browsers send octet-stream for docx/pdf
    ];

    if (allowedExtensions.includes(ext) || allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX documents are accepted.'));
    }
  }
});
