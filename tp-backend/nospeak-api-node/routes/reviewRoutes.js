const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');
const verifyRole = require('../middlewares/verifyRoleMiddleware');

router.get('/', verifyToken, reviewController.getReviews);
router.post('/', verifyToken, reviewController.createReview);
router.get('/:id', verifyToken, reviewController.getReviewById);
router.patch('/:id', verifyToken, reviewController.updateReview);
router.delete('/:id', verifyToken, verifyRole, reviewController.deleteReview);

module.exports = router;
