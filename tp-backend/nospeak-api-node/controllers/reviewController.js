const Review = require('../models/review');
const FollowRelation = require('../models/followRelation');


exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('song user');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createReview = async (req, res) => {
  try {
    const { creation_date, song, user, score, description } = req.body;

    const newReview = new Review({
      creation_date, 
      song, 
      user,
      score,
      description,
    });

    await newReview.save();

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};


exports.getReviewById = async (req, res) => {
  const reviewId = req.params.id;
  try {
    const review = await Review.findById(reviewId).populate('song user');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { creation_date, song, user, score, description } = req.body;

  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { creation_date, song, user, score, description},
      { new: true }
    ).populate('song user');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByIdAndRemove(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getReviewByUsuario = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const reviews = await Review.find({ user: userId }).populate({
      path: 'song',
      populate: { path: 'artist' }
    }).populate('user');

    const followersCount = await FollowRelation.countDocuments({ following: userId });
    const reviewsCount = await Review.countDocuments({ user: userId });

    const enrichedReviews = await Promise.all(reviews.map(async (review) => {
   
      return {
        ...review.toObject(),
        user: {
          ...review.user.toObject(),
          followersCount: followersCount,
          reviewsCount: reviewsCount
        }
      };
    }));

    res.status(200).json(enrichedReviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
