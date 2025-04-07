const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.get('/:user_id', verifyToken, collectionController.getCollectionsByUser);

module.exports = router;
