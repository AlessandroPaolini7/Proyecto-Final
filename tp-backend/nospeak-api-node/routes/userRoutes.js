const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const verifyRole = require('../middlewares/verifyRoleMiddleware');
const { uploadProfilePicture, generateProfilePictureLink } = require('../middlewares/uploadFileMiddleware');

router.get('/', verifyToken, verifyRole, userController.getUsers);
router.post('/', uploadProfilePicture, generateProfilePictureLink, userController.createUser);
router.get('/:id', verifyToken, userController.getUserById);
router.patch('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.get('/stats/:id', verifyToken, userController.getUserStats);
router.get('/following/:id', verifyToken, userController.getUserFollowing);
router.get('/not-following/:id', verifyToken, userController.getUserNotFollowing);
router.get('/followers/:id', verifyToken, userController.getUserFollowers);

module.exports = router;
