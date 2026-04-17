import helpers from '../utils/helpers.js';
import constants from '../utils/constants.js';

const { createResponse } = helpers;
const { HTTP_STATUS } = constants;

class APIError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  return new APIError('Validation Error', HTTP_STATUS.BAD_REQUEST, errors);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;

  return new APIError('Duplicate Field', HTTP_STATUS.CONFLICT, [message]);
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new APIError('Invalid Input', HTTP_STATUS.BAD_REQUEST, [message]);
};

const handleJWTError = () => {
  return new APIError('Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
};

const handleJWTExpiredError = () => {
  return new APIError('Token expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send response
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  // Include error details in development
  const meta = process.env.NODE_ENV === 'development' ? {
    stack: err.stack,
    error: err,
  } : undefined;

  res.status(statusCode).json(
    createResponse(false, message, null, meta)
  );
};

const handleUnhandledRejection = (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);

  // Graceful shutdown
  process.exit(1);
};

const handleUncaughtException = (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);

  // Graceful shutdown
  process.exit(1);
};

const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json(
    createResponse(false, `Cannot find ${req.method} ${req.originalUrl} on this server`)
  );
};

export default {
  APIError,
  globalErrorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  notFoundHandler,
};

