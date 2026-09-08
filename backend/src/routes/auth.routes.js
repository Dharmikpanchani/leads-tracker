import express from 'express';
import {
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOtp,
  resendOtp,
  setPassword,
} from '../controller/AuthController.js';
import { validateRequest } from '../middleware/Validator.js';
import { loginSchema } from '../utils/Validation.js';
import { authLimiter } from '../middleware/RateLimit.js';
import { authMiddleware } from '../middleware/Auth.js';

const router = express.Router();

router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);

// Password recovery & OTP routes
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/set-password', setPassword);

export default router;
