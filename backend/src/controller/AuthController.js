import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  comparePassword,
  hashPassword,
} from '../utils/AuthHelper.js';
import { ResponseHandler, CatchErrorHandler } from '../services/CommonServices.js';
import responseMessage from '../utils/ResponseMessage.js';
import config from '../config/index.js';
import { sendForgotPasswordOtpEmail } from '../services/EmailService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false });
    if (!user) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.INVALID_CREDENTIALS
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.INVALID_CREDENTIALS
      );
    }

    const payload = { id: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = config.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.LOGIN_SUCCESS,
      {
        user: userData,
        accessToken,
      }
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.REFRESH_TOKEN_REQUIRED
      );
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.TOKEN_EXPIRED
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.USER_NOT_FOUND
      );
    }

    const payload = { id: user.id, email: user.email };
    const newAccessToken = generateAccessToken(payload);

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.REFRESH_SUCCESS,
      {
        accessToken: newAccessToken,
        user,
      }
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: config.NODE_ENV === 'production',
    });

    return ResponseHandler(res, StatusCodes.OK, responseMessage.LOGOUT_SUCCESS);
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ResponseHandler(res, StatusCodes.NOT_FOUND, responseMessage.USER_NOT_FOUND);
    }

    return ResponseHandler(res, StatusCodes.OK, responseMessage.PROFILE_FETCHED, user);
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return ResponseHandler(res, StatusCodes.BAD_REQUEST, responseMessage.NAME_REQUIRED);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true }
    );
    return ResponseHandler(res, StatusCodes.OK, responseMessage.PROFILE_UPDATED, updatedUser);
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ email: req.user.email?.toLowerCase().trim(), isDeleted: false });
    if (!user) {
      return ResponseHandler(res, StatusCodes.NOT_FOUND, responseMessage.USER_NOT_FOUND);
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return ResponseHandler(res, StatusCodes.BAD_REQUEST, responseMessage.CURRENT_PASSWORD_MISMATCH);
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.PASSWORD_CHANGED
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

// Forgot Password Request OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail, isDeleted: false });
    if (!user) {
      return ResponseHandler(
        res,
        StatusCodes.NOT_FOUND,
        responseMessage.EMAIL_NOT_REGISTERED
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hashPassword(otp);

    // Save encrypted/hashed OTP with 5 minute expiration
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({
      email: cleanEmail,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      isVerified: false,
      isUsed: false,
    });

    console.log(`[OTP DISPATCH] Generated & Hashed OTP for ${cleanEmail}: ${otp}`);

    // Send Real OTP Email in background non-blocking (using setImmediate)
    sendForgotPasswordOtpEmail(cleanEmail, otp);

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.OTP_SENT,
      { email: cleanEmail }
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    const record = await Otp.findOne({
      email: cleanEmail,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record) {
      return ResponseHandler(
        res,
        StatusCodes.BAD_REQUEST,
        responseMessage.OTP_EXPIRED
      );
    }

    // Compare plain OTP against encrypted/hashed OTP
    const isMatch = await comparePassword(String(otp).trim(), record.otp);
    if (!isMatch) {
      return ResponseHandler(
        res,
        StatusCodes.BAD_REQUEST,
        responseMessage.OTP_INVALID
      );
    }

    record.isVerified = true;
    await record.save();

    return ResponseHandler(res, StatusCodes.OK, responseMessage.OTP_VERIFIED);
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail, isDeleted: false });
    if (!user) {
      return ResponseHandler(res, StatusCodes.NOT_FOUND, responseMessage.USER_NOT_FOUND);
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hashPassword(otp);

    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({
      email: cleanEmail,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      isUsed: false,
    });

    console.log(`[OTP RESEND] New Generated & Hashed OTP for ${cleanEmail}: ${otp}`);

    // Resend Real OTP Email in background non-blocking (using setImmediate)
    sendForgotPasswordOtpEmail(cleanEmail, otp);

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.OTP_RESENT
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

// Set New Password
export const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    const record = await Otp.findOne({
      email: cleanEmail,
      isVerified: true,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record) {
      return ResponseHandler(
        res,
        StatusCodes.FORBIDDEN,
        responseMessage.OTP_REQUIRED_BEFORE_RESET
      );
    }

    const hashedPassword = await hashPassword(password);
    await User.findOneAndUpdate(
      { email: cleanEmail, isDeleted: false },
      { password: hashedPassword }
    );

    record.isUsed = true;
    await record.save();
    await Otp.deleteMany({ email: cleanEmail });

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.PASSWORD_RESET_SUCCESS
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export default {
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
};
