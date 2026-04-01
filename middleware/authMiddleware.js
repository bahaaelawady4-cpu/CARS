const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes: Verification of the JWT token
 */
const protect = async (req, res, next) => {
  let token;

  // Check for the token in the Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (found by decoded id) to the request, excluding the password
      req.user = await User.findById(decoded.id);

      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  // No token found at all
  res.status(401);
  return next(new Error('Not authorized, no token provided'));
};

/**
 * Middleware to authorize based on user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      return next(
        new Error(`User role '${req.user.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
