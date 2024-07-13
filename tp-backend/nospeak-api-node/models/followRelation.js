const mongoose = require('mongoose');

const followRelationSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creation_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FollowRelation', followRelationSchema);