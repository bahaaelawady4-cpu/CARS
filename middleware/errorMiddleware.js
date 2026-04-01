/**
 * Global Error Handling Middleware
 * This catches all errors passed to next() and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // If no status code is set, default to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';

  // Specific handling for common Mongoose errors
  
  // 1. Mongoose Bad ObjectId (CastError) - e.g., using an invalid ID in the URL
  if (err.name === 'CastError') {
    message = `Resource not found with ID of ${err.value}`;
    statusCode = 404;
  }

  // 2. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
  }

  // 3. Mongoose Duplicate Key Error (e.g., trying to use an existing email)
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    // Provide stack trace only in development mode for easier debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
