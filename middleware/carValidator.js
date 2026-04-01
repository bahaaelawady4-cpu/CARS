/**
 * Middleware to validate car data before it reaches the controller.
 * Checks for required fields, correct data types, and meaningful values.
 */
const validateCar = (req, res, next) => {
  const { name, brand } = req.body || {};
  
  // multer sends everything as strings in multipart/form-data
  const price = Number(req.body.price);
  const year = Number(req.body.year);

  const errors = [];

  // 1. Check for required fields and non-empty strings
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Car name is required');
  }
  
  if (!brand || typeof brand !== 'string' || brand.trim() === '') {
    errors.push('Brand is required');
  }

  // 2. Check for numeric types and logical ranges
  if (!req.body.price || isNaN(price) || price < 0) {
    errors.push('Price must be a positive number');
  }

  if (!req.body.year || isNaN(year)) {
    errors.push('Year is required and must be a number');
  } else {
    const currentYear = new Date().getFullYear();
    if (year < 1886 || year > currentYear) {
      errors.push(`Year must be between 1886 and ${currentYear}`);
    }
  }

  // 3. If there are any errors, stop the request and return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // 4. If everything is fine, move to the next step (the controller)
  next();
};

module.exports = validateCar;
