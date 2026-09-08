import { StatusCodes } from 'http-status-codes';
import { ResponseHandler } from '../services/CommonServices.js';

export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return ResponseHandler(
        res,
        StatusCodes.BAD_REQUEST,
        errorDetails[0]?.message || 'Validation error',
        null,
        { errors: errorDetails }
      );
    }

    req[property] = value;
    next();
  };
};

export default validateRequest;
