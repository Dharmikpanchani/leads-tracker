import mongoose from 'mongoose';
import config from './index.js';

export const initDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(config.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return conn.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

export const closeDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
  }
};

export default initDb;
