import mongoose from 'mongoose';
import { MONGODB_URI } from './constants';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
  } catch (err: any) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    console.warn('[MongoDB] Server will continue, but database operations may fail if MongoDB is offline.');
  }
}
