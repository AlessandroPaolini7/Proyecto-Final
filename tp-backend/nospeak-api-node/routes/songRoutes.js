const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const verifyRole = require('../middlewares/verifyRoleMiddleware');

router.get('/', verifyToken, songController.getSongs);
router.post('/', verifyToken, verifyRole, songController.createSong);
router.get('/:id', verifyToken, songController.getSongById);
router.patch('/:id', verifyToken, verifyRole, songController.updateSong);
router.delete('/:id', verifyToken, verifyRole, songController.deleteSong);

module.exports = router;
