const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const verifyRole = require('../middlewares/verifyRoleMiddleware');

router.get('/', verifyToken, artistController.getArtists);
router.post('/', verifyToken, verifyRole, artistController.createArtist);
router.get('/:id', verifyToken, artistController.getArtistById);
router.patch('/:id', verifyToken, verifyRole, artistController.updateArtist);
router.delete('/:id', verifyToken, verifyRole, artistController.deleteArtist);

module.exports = router;
