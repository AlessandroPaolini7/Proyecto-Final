const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationality: { type: String, required: true },
  followers: { type: Number, required: true },
  picture: { type: String, required: false },
});

module.exports = mongoose.model('Artist', artistSchema);
