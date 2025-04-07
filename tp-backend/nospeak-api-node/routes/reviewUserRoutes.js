const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const verifyRole = require('../middlewares/verifyRoleMiddleware');

router.get('/:user_id', verifyToken, reviewController.getReviewByUsuario);

module.exports = router;
