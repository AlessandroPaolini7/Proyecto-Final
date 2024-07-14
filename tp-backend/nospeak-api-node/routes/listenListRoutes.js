const express = require('express');
const router = express.Router();
const listenListController = require('../controllers/listenListController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const { uploadProfilePicture, generateProfilePictureLink } = require('../middlewares/uploadFileMiddleware');

router.get('/', verifyToken, listenListController.getListenLists);
router.post('/', verifyToken, uploadProfilePicture, generateProfilePictureLink, listenListController.createListenList);
router.get('/:id', verifyToken, listenListController.getListenListById);
router.patch('/:id', verifyToken, listenListController.updateListenList);
router.delete('/:id', verifyToken, listenListController.deleteListenList);

module.exports = router;
