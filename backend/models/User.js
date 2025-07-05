const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  description: { type: String, default: '' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
