const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Admin = require('../models/admin.model');

// POST /api/admin/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username, isActive: true }).select('+passwordHash');
  if (!admin) {
    return sendError(res, 'Invalid username or password.', 401);
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid username or password.', 401);
  }

  const payload = {
    id: admin._id.toString(),
    username: admin.username,
    role: admin.role,
    tokenVersion: admin.tokenVersion || 0,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Set refresh token as httpOnly secure cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return sendSuccess(
    res,
    {
      accessToken,
      admin: { id: admin._id, name: admin.name, username: admin.username, role: admin.role },
    },
    'Login successful'
  );
};

// POST /api/admin/auth/refresh
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return sendError(res, 'No refresh token provided.', 401);

  try {
    const decoded = verifyRefreshToken(token);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) return sendError(res, 'Admin not found or inactive.', 401);

    // Verify tokenVersion against revocation
    if (decoded.tokenVersion !== undefined && admin.tokenVersion !== undefined) {
      if (decoded.tokenVersion !== admin.tokenVersion) {
        return sendError(res, 'Refresh token has been revoked.', 401);
      }
    }

    const payload = {
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role,
      tokenVersion: admin.tokenVersion || 0,
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Rotate refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch {
    return sendError(res, 'Invalid or expired refresh token.', 401);
  }
};

// POST /api/admin/auth/logout
const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      if (decoded?.id) {
        // Invalidate active token family by incrementing tokenVersion
        await Admin.findByIdAndUpdate(decoded.id, { $inc: { tokenVersion: 1 } });
      }
    } catch {
      // Token may already be expired or invalid
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  return sendSuccess(res, null, 'Logged out successfully');
};

module.exports = { login, refreshToken, logout };
