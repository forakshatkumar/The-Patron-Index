const crypto = require('crypto');
const Session = require('../models/Session');
const NAME = 'patron_session';
const TTL = 30 * 24 * 60 * 60 * 1000;
const digest = token => crypto.createHash('sha256').update(token).digest('hex');
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
function readCookie(req) {
  const value = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${NAME}=`))?.slice(NAME.length + 1);
  return /^[a-f0-9]{64}$/.test(value || '') ? value : null;
}
async function revoke(req) {
  const token = readCookie(req);
  if (token) await Session.deleteOne({ digest: digest(token) });
}
async function issue(req, res, user) {
  await revoke(req);
  const token = crypto.randomBytes(32).toString('hex');
  await Session.create({ digest: digest(token), user: user._id, expiresAt: new Date(Date.now() + TTL) });
  res.cookie(NAME, token, { ...cookieOptions(), maxAge: TTL });
}
function clear(res) { res.clearCookie(NAME, cookieOptions()); }
module.exports = { readCookie, digest, issue, revoke, clear };
