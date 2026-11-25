const bcrypt = require('bcryptjs');
const User = require('../models/User');
const createAuditLog = require('../utils/auditLogger');

const { issue, revoke, clear, readCookie } = require('../utils/session');
const Session = require('../models/Session');
function publicUser(user) {
  const { _id, name, email, role, avatar, businessName, industry, location, phone, bio, createdAt, preferences } = user;
  return { id: _id, name, email, role, avatar, businessName, industry, location, phone, bio, createdAt, preferences };
}

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || typeof email !== 'string' || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Password must be at least 6 characters and no more than 72 UTF-8 bytes' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: 'An account already exists with this email address'
      });
    }

    // Hash with 12 salt rounds for enhanced security
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'analyst'
    });

    await issue(req, res, user);

    await createAuditLog({
      userId: user._id,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: user._id.toString(),
      details: `User registered with email ${normalizedEmail}`,
      ipAddress: req.ip
    });

    res.status(201).json({
      message: 'Account created successfully',
      userId: user._id,
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Valid email and password strings are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    await issue(req, res, user);

    await createAuditLog({
      userId: user._id,
      action: 'USER_LOGGED_IN',
      resource: 'User',
      resourceId: user._id.toString(),
      details: `User logged in: ${normalizedEmail}`,
      ipAddress: req.ip
    });

    res.json({
      message: 'Login successful',
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth verification and login/register
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ message: 'Google credential token is required' });
    }

    const expectedClientId = process.env.GOOGLE_CLIENT_ID || '978238561753-daj7ignsgo9lbg31ag5c0ke3lukuarbh.apps.googleusercontent.com';
    let googleRes;
    try { googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, { signal: AbortSignal.timeout(10000) }); } catch { return res.status(503).json({ message: 'Google sign-in is temporarily unavailable. Try again.' }); }
    if (!googleRes.ok) {
      return res.status(401).json({ message: 'Invalid or expired Google credential' });
    }

    const payload = await googleRes.json();

    if (payload.aud !== expectedClientId || !['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss) || !(Number(payload.exp) > Date.now()/1000) || !payload.sub) {
      return res.status(401).json({ message: 'Google token audience mismatch' });
    }

    const { email, name, sub: googleId, picture: avatar } = payload;
    if (!email || String(payload.email_verified) !== 'true') {
      return res.status(400).json({ message: 'A verified Google email is required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user for first-time Google sign-in
      const randomPassword = require('crypto').randomBytes(24).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = await User.create({
        name: name ? String(name).trim() : 'Google User',
        email: normalizedEmail,
        password: hashedPassword,
        googleId,
        avatar: avatar || '',
        role: 'analyst'
      });

      await createAuditLog({
        userId: user._id,
        action: 'USER_GOOGLE_REGISTER',
        resource: 'User',
        resourceId: user._id.toString(),
        details: `User created via Google OAuth: ${normalizedEmail}`,
        ipAddress: req.ip
      });
    } else if (user.googleId && user.googleId !== googleId) {
      return res.status(401).json({ message: 'Google account mismatch' });
    } else if (!user.googleId) {
      if (!normalizedEmail.endsWith('@gmail.com') && !payload.hd) return res.status(409).json({ message: 'Sign in using your existing password for this email.' });
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    await issue(req, res, user);

    res.json({
      message: 'Google authentication successful',
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(401).json({ message: 'Account unavailable' });
    // Migrate valid legacy bearer credentials to a persistent cookie.
    if (!readCookie(req)) await issue(req, res, user);
    res.set('Cache-Control', 'no-store').json({ user: publicUser(user) });
  } catch (error) { next(error); }
};
const updateProfile = async (req, res, next) => {
  try {
    const patch = {};
    for (const [key, max] of Object.entries({ name: 100, businessName: 120, industry: 100, location: 120, phone: 40, bio: 500 })) {
      if (req.body[key] === undefined) continue;
      if (typeof req.body[key] !== 'string' || req.body[key].length > max || (key === 'name' && !req.body[key].trim())) return res.status(400).json({ message: `Invalid ${key}` });
      patch[key] = req.body[key].trim();
    }
    if (req.body.avatar !== undefined) {
      const value = req.body.avatar;
      if (typeof value !== 'string' || value.length > 350000 || (value && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value))) return res.status(400).json({ message: 'Invalid profile image' });
      patch.avatar = value;
    }
    if (req.body.preferences !== undefined) {
      const p = req.body.preferences;
      if (!p || !['light','dark','system'].includes(p.theme) || typeof p.reducedMotion !== 'boolean' || typeof p.notifications !== 'boolean') return res.status(400).json({ message: 'Invalid preferences' });
      patch.preferences = { theme: p.theme, reducedMotion: p.reducedMotion, notifications: p.notifications };
    }
    const user = await User.findByIdAndUpdate(req.user.userId, { $set: patch }, { new: true, runValidators: true });
    if (!user) return res.status(401).json({ message: 'Account unavailable' });
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
};
const logout = async (req, res, next) => {
  try { await revoke(req); clear(res); res.json({ message: 'Signed out' }); } catch (error) { next(error); }
};
const logoutAll = async (req, res, next) => {
  try { await Session.deleteMany({ user: req.user.userId }); clear(res); res.json({ message: 'All sessions signed out' }); } catch (error) { next(error); }
};
module.exports = { register, login, googleAuth, me, updateProfile, logout, logoutAll };
