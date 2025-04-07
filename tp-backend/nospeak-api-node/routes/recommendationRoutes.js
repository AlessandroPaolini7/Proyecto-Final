const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.post('/', verifyToken, recommendationController.createRecommendation);

module.exports = router;
