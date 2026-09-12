const { v4: uuidv4 } = require('uuid');
const Session = require('../models/session.model');

/**
 * Session middleware — runs on storefront requests (cart, checkout, etc.).
 * Reads sessionToken from httpOnly cookie OR x-session-token header.
 * Creates a new session if none exists.
 * Attaches session document to req.session.
 */
const sessionMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.sessionToken || req.headers['x-session-token'];

    if (token) {
      // Try to find existing session
      let session = await Session.findOne({ sessionToken: token });

      if (session) {
        // Refresh lastActiveAt and extend expiry
        session.lastActiveAt = new Date();
        session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await session.save();
        req.session = session;
        res.setHeader('x-session-token', token);
        return next();
      }
    }

    // No valid session — create a new one
    token = uuidv4();
    const session = await Session.create({ sessionToken: token });

    // Set httpOnly cookie (30 days)
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.setHeader('x-session-token', token);
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sessionMiddleware;
