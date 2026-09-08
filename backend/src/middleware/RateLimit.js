import rateLimit from 'express-rate-limit';
import responseMessage from '../utils/ResponseMessage.js';
import config from '../config/index.js';

const isDev = config.NODE_ENV === 'development';

export const apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_MAX_API,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: {
    success: false,
    statusCode: 429,
    message: responseMessage.RATE_LIMIT_API,
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.RATE_MAX_AUTH,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: {
    success: false,
    statusCode: 429,
    message: responseMessage.RATE_LIMIT_AUTH,
  },
});

export default { apiLimiter, authLimiter };
