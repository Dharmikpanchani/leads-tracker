import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const hashPassword = async (plainPassword, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};

export default {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

