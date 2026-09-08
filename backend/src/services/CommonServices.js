import { StatusCodes } from 'http-status-codes';
import responseMessage from '../utils/ResponseMessage.js';

export const ResponseHandler = (res, statusCode = StatusCodes.OK, message = '', data = null, meta = null) => {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  const payload = {
    success: isSuccess,
    statusCode,
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const CatchErrorHandler = (res, error, customMessage = responseMessage.INTERNAL_SERVER_ERROR) => {
  console.error('Unhandled Error:', error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: customMessage,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};

export default { ResponseHandler, CatchErrorHandler };
