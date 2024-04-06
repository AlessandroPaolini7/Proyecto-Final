const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  creation_date: { type: Date, default: Date.now },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Review', reviewSchema);
