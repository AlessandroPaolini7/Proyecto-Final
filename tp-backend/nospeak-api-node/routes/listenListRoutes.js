const express = require('express');
const router = express.Router();
const listenListController = require('../controllers/listenListController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.get('/', verifyToken, listenListController.getListenLists);
router.post('/', verifyToken, listenListController.createListenList);
router.get('/:id', verifyToken, listenListController.getListenListById);
router.patch('/:id', verifyToken, listenListController.updateListenList);
router.delete('/:id', verifyToken, listenListController.deleteListenList);

module.exports = router;
