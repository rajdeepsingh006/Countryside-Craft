const { v4: uuidv4 } = require('uuid');
const Session = require('../models/session.model');

/**
 * Session middleware — runs on storefront requests (cart, checkout, etc.).
 * Reads sessionToken from httpOnly cookie OR x-session-token header.
 * Uses lazy session creation: does NOT write empty documents to MongoDB for anonymous browsing.
 * Throttles lastActiveAt writes to at most once per 24 hours.
 */
const sessionMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.sessionToken || req.headers['x-session-token'];

    if (token) {
      const session = await Session.findOne({ sessionToken: token });

      if (session) {
        // Only refresh lastActiveAt once per 24 hours to avoid heavy database write load
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        if (!session.lastActiveAt || session.lastActiveAt.getTime() < oneDayAgo) {
          session.lastActiveAt = new Date();
          session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await session.save();
        }

        req.session = session;
        res.setHeader('x-session-token', token);
        return next();
      }
    }

    // New visitor token
    token = token || uuidv4();

    // If this request is an explicit cart write, create the document in database
    const isCartMutation = req.baseUrl?.includes('/cart') && ['POST', 'PUT', 'PATCH'].includes(req.method);

    if (isCartMutation) {
      const session = await Session.create({
        sessionToken: token,
        cartItems: [],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      req.session = session;
    } else {
      // Ephemeral in-memory session object with save() capability
      req.session = {
        sessionToken: token,
        cartItems: [],
        isNew: true,
        save: async function () {
          return Session.findOneAndUpdate(
            { sessionToken: token },
            {
              sessionToken: token,
              cartItems: this.cartItems,
              lastActiveAt: new Date(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            { upsert: true, new: true }
          );
        },
      };
    }

    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.setHeader('x-session-token', token);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sessionMiddleware;
