const express = require('express');
const router = express.Router();
const listenListController = require('../controllers/listenListController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.get('/:user_id', verifyToken, listenListController.getListenListsByUser);

module.exports = router;
