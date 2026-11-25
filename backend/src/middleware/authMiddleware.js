const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { readCookie, digest } = require('../utils/session');
module.exports = async (req, res, next) => {
  try {
    const cookie = readCookie(req);
    let userId;
    if (cookie) {
      const session = await Session.findOne({ digest: digest(cookie), expiresAt: { $gt: new Date() } }).lean();
      if (session) userId = session.user;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      // Compatibility for previously issued, unexpired tokens only.
      const secret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'patron_index_dev_secret_key_secure_2026' : null);
      if (secret) {
        try { userId = jwt.verify(req.headers.authorization.slice(7), secret).userId; } catch { /* invalid token */ }
      }
    }
    if (!userId) return res.status(401).json({ message: 'Authentication required' });
    const user = await User.findById(userId).select('role').lean();
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    req.user = { userId: String(user._id), role: user.role };
    next();
  } catch (error) { next(error); }
};
