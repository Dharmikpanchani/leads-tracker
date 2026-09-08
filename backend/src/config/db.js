import dns from 'dns';
import mongoose from 'mongoose';
import config from './index.js';

// DNS servers fallback to fix querySrv ECONNREFUSED on local ISP/routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback failure
}

export const initDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      tlsAllowInvalidCertificates: true,
      retryReads: true,
      retryWrites: true,
    });

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
