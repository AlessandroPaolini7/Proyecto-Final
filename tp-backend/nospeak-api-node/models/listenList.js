const mongoose = require('mongoose');

const listenListSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  creation_date: { type: Date, default: Date.now, required: false},
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  picture: { type: String, required: false },
});

module.exports = mongoose.model('ListenList', listenListSchema);
