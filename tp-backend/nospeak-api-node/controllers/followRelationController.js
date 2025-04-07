const FollowRelation = require('../models/followRelation');
const User = require('../models/user');

// Obtener todas las relaciones de seguimiento
exports.getFollowRelations = async (req, res) => {
  try {
    const followRelations = await FollowRelation.find()
      .populate('follower')
      .populate('following');
    return res.status(200).json(followRelations);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

// Crear una nueva relación de seguimiento
exports.createFollowRelation = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).json({ mensaje: 'User not found' });
    }

    const newFollowRelation = new FollowRelation({
      follower: followerId,
      following: followingId,
    });

    await newFollowRelation.save();

    return res.status(200).json({ mensaje: 'Follow relation created successfully' });
  } catch (error) {
    return res.status(500).json({ mensaje: `Internal server error: ${error}` });
  }
};

// Obtener una relación de seguimiento por ID
exports.getFollowRelationById = async (req, res) => {
  try {
    const followRelation = await FollowRelation.findById(req.params.id)
      .populate('follower')
      .populate('following');

    if (!followRelation) {
      return res.status(404).json({ mensaje: 'Follow relation not found' });
    }

    return res.status(200).json(followRelation);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

// Eliminar una relación de seguimiento
exports.deleteFollowRelation = async (req, res) => {
  try {
    const { id } = req.params;

    const followRelation = await FollowRelation.findById(id);

    if (!followRelation) {
      return res.status(404).json({ mensaje: 'Follow relation not found' });
    }

    await FollowRelation.findByIdAndRemove(id);

    return res.status(200).json({ mensaje: 'Follow relation deleted successfully' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

// Eliminar una relación de seguimiento por followerId y followingId
exports.deleteFollowRelationByIds = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    const followRelation = await FollowRelation.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!followRelation) {
      return res.status(404).json({ mensaje: 'Follow relation not found' });
    }

    return res.status(200).json({ mensaje: 'Follow relation deleted successfully' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

// Obtener relaciones de seguimiento de un usuario
exports.getFollowRelationsByUser = async (req, res) => {
  try {
    const { user_id: userId } = req.params;

    const followRelations = await FollowRelation.find({
      $or: [{ follower: userId }, { following: userId }]
    })
    .populate('follower')
    .populate('following');

    return res.status(200).json(followRelations);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

