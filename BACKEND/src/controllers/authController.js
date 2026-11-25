const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET || 'secret', {
    expiresIn: '15m'
  });
  
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Your account is inactive or locked' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save session
    await Session.create({
      userId: user._id,
      refreshToken,
      deviceInfo: {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    user.lastLogin = new Date();
    user.failedLoginAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Clean user object before sending
    const userResponse = user.toObject();
    delete userResponse.password;

    const { logAudit } = require('../middlewares/auditMiddleware');
    await logAudit(
      { user: userResponse, ip: req.ip, get: req.get.bind(req), connection: req.connection }, 
      'LOGIN_SUCCESS', 
      'User', 
      userResponse._id, 
      { email: userResponse.email }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const session = await Session.findOne({ refreshToken, isValid: true });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
      
      // Generate new tokens
      const tokens = generateTokens(decoded.id);

      // Invalidate old session and create a new one (rotation)
      session.isValid = false;
      await session.save();

      await Session.create({
        userId: decoded.id,
        refreshToken: tokens.refreshToken,
        deviceInfo: {
          ip: req.ip,
          userAgent: req.headers['user-agent']
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.status(200).json({
        success: true,
        data: tokens
      });
    } catch (err) {
      session.isValid = false;
      await session.save();
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await Session.findOneAndUpdate(
        { refreshToken },
        { isValid: false }
      );
    }
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
