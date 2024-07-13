const express = require('express');
const router = express.Router();
const followRelationController = require('../controllers/followRelationController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.get('/:user_id', verifyToken, followRelationController.getFollowRelationsByUser);

module.exports = router;
