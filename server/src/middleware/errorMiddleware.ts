import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error Middleware]:', err);

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File is too large. Maximum allowed file size is 10MB.'
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
    return;
  }

  // Handle custom upload validation errors
  if (err.message && err.message.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
