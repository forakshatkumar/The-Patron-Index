const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  digest: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
});
module.exports = mongoose.model('Session', schema);
