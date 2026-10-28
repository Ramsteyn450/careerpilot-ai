import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { PORT } from './config/constants';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorMiddleware';
import { uploadResume } from './middleware/uploadMiddleware';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import resumeRoutes from './routes/resumeRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads directory (read-only for generated previews if needed)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CareerPilot AI API'
  });
});

// Direct fast resume text parsing endpoint (unauthenticated local helper fallback)
app.post('/api/parse-resume-text', uploadResume.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileType = ext === '.pdf' ? 'pdf' : 'docx';
    const { DocumentParserService } = await import('./services/documentParserService');
    const text = await DocumentParserService.extractRawText(req.file.path, fileType);
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (_) {}
    return res.json({ success: true, text });
  } catch (err: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    return res.status(400).json({ success: false, message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect DB & Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[CareerPilot AI] Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
