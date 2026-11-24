const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createAuditLog = require('../utils/auditLogger');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production');
    }
    return 'patron_index_dev_secret_key_secure_2026';
  }
  return secret;
}

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters in length' });
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
      role: role === 'admin' ? 'admin' : 'analyst'
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

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
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
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

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

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
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
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

    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!googleRes.ok) {
      return res.status(401).json({ message: 'Invalid or expired Google credential' });
    }

    const payload = await googleRes.json();
    const expectedClientId = process.env.GOOGLE_CLIENT_ID || '978238561753-daj7ignsgo9lbg31ag5c0ke3lukuarbh.apps.googleusercontent.com';

    if (payload.aud !== expectedClientId) {
      return res.status(401).json({ message: 'Google token audience mismatch' });
    }

    const { email, name, sub: googleId, picture: avatar } = payload;
    if (!email) {
      return res.status(400).json({ message: 'No email associated with Google account' });
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
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, googleAuth };
