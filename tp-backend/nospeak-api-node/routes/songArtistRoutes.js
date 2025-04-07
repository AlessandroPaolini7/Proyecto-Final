const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const verifyRole = require('../middlewares/verifyRoleMiddleware');

router.get('/:artist_id', verifyToken, songController.getSongsByArtist);

module.exports = router;
