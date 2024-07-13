const express = require('express');
const router = express.Router();
const followRelationController = require('../controllers/followRelationController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.get('/', verifyToken, followRelationController.getFollowRelations);
router.post('/', verifyToken, followRelationController.createFollowRelation);
router.get('/:id', verifyToken, followRelationController.getFollowRelationById);
router.delete('/:id', verifyToken, followRelationController.deleteFollowRelation);
router.delete('/', verifyToken, followRelationController.deleteFollowRelationByIds);

module.exports = router;
