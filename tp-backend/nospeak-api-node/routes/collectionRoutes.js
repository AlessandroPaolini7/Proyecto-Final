const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const { uploadProfilePicture, generateProfilePictureLink } = require('../middlewares/uploadFileMiddleware');


router.get('/', verifyToken, collectionController.getCollections);
router.post('/', verifyToken, uploadProfilePicture, generateProfilePictureLink, collectionController.createCollection);
router.get('/:id', verifyToken, collectionController.getCollectionById);
router.patch('/:id', verifyToken, collectionController.updateCollection);
router.delete('/:id', verifyToken, collectionController.deleteCollection);

module.exports = router;
