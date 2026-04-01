const User = require('../models/User');

// ─── REGISTER USER ────────────────────────────────────────────
// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user (password hashing happens in the model's pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create token using the model's member method
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN USER ───────────────────────────────────────────────
// @desc   Authenticate user & get token
// @route  POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate email & password presence
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    // 2. Check for user (must use +password because it's set to select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // 4. Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
