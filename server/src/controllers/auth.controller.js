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

  const payload = { id: admin._id, username: admin.username, role: admin.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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

    const payload = { id: admin._id, username: admin.username, role: admin.role };
    const accessToken = generateAccessToken(payload);

    return sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch {
    return sendError(res, 'Invalid or expired refresh token.', 401);
  }
};

// POST /api/admin/auth/logout
const logout = (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
  return sendSuccess(res, null, 'Logged out successfully');
};

module.exports = { login, refreshToken, logout };
