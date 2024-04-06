const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const userLoginRoutes = require('./userLoginRoutes');
const artistRoutes = require('./artistRoutes');
const songRoutes = require('./songRoutes');
const songArtistRoutes = require('./songArtistRoutes');
const collectionRoutes = require('./collectionRoutes');
const collectionUserRoutes = require('./collectionUserRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const reviewRoutes = require('./reviewRoutes');
const reviewUserRoutes = require('./reviewUserRoutes');
const listenListRoutes = require('./listenListRoutes');
const listenListUserRoutes = require('./listenListUserRoutes');


router.use('/user', userRoutes);
router.use('/user-login', userLoginRoutes);
router.use('/artists', artistRoutes);
router.use('/songs', songRoutes);
router.use('/songs-artist', songArtistRoutes);
router.use('/collections', collectionRoutes);
router.use('/collections-user', collectionUserRoutes);
router.use('/recommendation', recommendationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/reviews-user', reviewUserRoutes);
router.use('/listenlists', listenListRoutes);
router.use('/listenlists-user', listenListUserRoutes);

module.exports = router;
