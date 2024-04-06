
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  picture: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);
