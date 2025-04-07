const User = require('../models/user');
const FollowRelation = require('../models/followRelation');
const Review = require('../models/review');
const Collection = require('../models/collection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = await FollowRelation.countDocuments({ following: user._id });
    const reviewsCount = await Review.countDocuments({ user: user._id });
    const collectionCount = await Collection.countDocuments({ user: user._id });

    const userWithStats = {
      ...user.toObject(),
      followersCount,
      reviewsCount,
      collectionCount,
      reviews: await Review.find({ user: user._id })
        .populate({
          path: 'song',
          populate: {
            path: 'artist',
            select: 'name picture'
          }
        })
    };

    return res.status(200).json(userWithStats);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only update fields that are present in req.body
    for (const [key, value] of Object.entries(req.body)) {
      if (key === 'password') {
        const hashedPassword = await bcrypt.hash(value, 10);
        user[key] = hashedPassword;
      } else {
        user[key] = value;
      }
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await User.findByIdAndRemove(userId);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone_number, isAdmin, picture} = req.body;

    const existentUser = await User.findOne({ name });

    if (existentUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      phone_number,
      picture
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
  };

exports.loginUser = async (req, res) =>{
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, picture: user.picture, phone_number: user.phone_number},
      config.tokenSecretKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, picture: user.picture, phone_number: user.phone_number});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

};


// Obtener cantidad de seguidores, reseñas y colecciones de un usuario
exports.getUserStats = async (userId) => {
  const followersCount = await FollowRelation.countDocuments({ following: userId });
  const reviewsCount = await Review.countDocuments({ user: userId });
  const collectionCount = await Collection.countDocuments({ user: userId });

  return { followersCount, reviewsCount, collectionCount };
};


// Obtener seguidores de un usuario
exports.getUserFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await FollowRelation.find({ following: userId })
      .populate('follower');

    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener usuarios que sigue un usuario con estadísticas adicionales y última reseña
exports.getUserFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const followingRelations = await FollowRelation.find({ follower: userId })
      .populate('following');

    const followingWithStatsAndReview = await Promise.all(followingRelations.map(async (relation) => {
      const followingUser = relation.following;
      const stats = await exports.getUserStats(followingUser._id);
      
      // Obtener la última reseña del usuario
      const lastReview = await Review.findOne({ user: followingUser._id })
        .sort({ creation_date: -1 })
        .limit(1)
        .populate({
          path: 'song',
          populate: { path: 'artist' }
        });

      return { 
        ...followingUser.toObject(), 
        ...stats,
        lastReview: lastReview ? {
          _id: lastReview._id,
          description: lastReview.description,
          score: lastReview.score,
          creationDate: lastReview.creation_date,
          song: lastReview.song ? {
            _id: lastReview.song._id,
            title: lastReview.song.title,
            genre: lastReview.song.genre,
            artist: lastReview.song.artist ? {
              _id: lastReview.song.artist._id,
              name: lastReview.song.artist.name,
              nationality: lastReview.song.artist.nationality,
              followers: lastReview.song.artist.followers,
              picture: lastReview.song.artist.picture
            } : null
          } : null
        } : null
      };
    }));

    res.status(200).json(followingWithStatsAndReview);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserNotFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    // Obtener todos los usuarios
    const allUsers = await User.find();

    // Obtener los usuarios que el usuario sigue
    const followingRelations = await FollowRelation.find({ follower: userId }).populate('following');
    const followingIds = followingRelations.map(relation => relation.following._id.toString());

    // Filtrar los usuarios que el usuario no sigue
    const notFollowingUsers = allUsers.filter(user => !followingIds.includes(user._id.toString()) && user._id.toString() !== userId);

    // Obtener estadísticas de cada usuario no seguido
    const notFollowingWithStats = await Promise.all(notFollowingUsers.map(async (user) => {
      const followersCount = await FollowRelation.countDocuments({ following: user._id });
      const reviewsCount = await Review.countDocuments({ user: user._id });
      const collectionCount = await Collection.countDocuments({ user: user._id });

      return { ...user.toObject(), followersCount, reviewsCount, collectionCount };
    }));

    res.status(200).json(notFollowingWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
