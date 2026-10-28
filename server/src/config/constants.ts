import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai';
export const JWT_SECRET = process.env.JWT_SECRET || 'careerpilot_ai_super_secret_jwt_key_2026';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'careerpilot_ai_refresh_jwt_key_2026';
export const JWT_EXPIRES_IN = '2h';
export const REFRESH_EXPIRES_IN = '7d';

export const AI_PROVIDER = process.env.AI_PROVIDER || 'local'; // 'local' | 'gemini' | 'openai'
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
