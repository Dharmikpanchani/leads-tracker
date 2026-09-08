import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/AuthHelper.js';
import { ResponseHandler } from '../services/CommonServices.js';
import responseMessage from '../utils/ResponseMessage.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.TOKEN_REQUIRED
      );
    }

    let decoded = null;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.TOKEN_EXPIRED
      );
    }

    if (!decoded || !decoded.id) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.TOKEN_EXPIRED
      );
    }

    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) {
      return ResponseHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        responseMessage.USER_NOT_FOUND
      );
    }

    req.user = {
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
    };
    next();
  } catch {
    return ResponseHandler(
      res,
      StatusCodes.UNAUTHORIZED,
      responseMessage.INVALID_TOKEN
    );
  }
};

export default authMiddleware;

