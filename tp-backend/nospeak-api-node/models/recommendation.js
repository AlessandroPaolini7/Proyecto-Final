const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  creation_date: { type: Date, default: Date.now },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
