import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim())
    : [process.env.CLIENT_URL],
  DEV_ADMIN_EMAIL: process.env.DEV_ADMIN_EMAIL,
  DEV_ADMIN_PASSWORD: process.env.DEV_ADMIN_PASSWORD,
  SYSTEM_ADMIN_EMAIL: process.env.SYSTEM_ADMIN_EMAIL,
  SYSTEM_ADMIN_PASSWORD: process.env.SYSTEM_ADMIN_PASSWORD,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_APP_PASS: process.env.EMAIL_APP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_MAX_API: parseInt(process.env.RATE_MAX_API) || 1000,
  RATE_MAX_AUTH: parseInt(process.env.RATE_MAX_AUTH) || 100,
};

export default config;
