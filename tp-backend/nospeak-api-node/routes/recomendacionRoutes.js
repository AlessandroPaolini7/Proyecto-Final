const express = require('express');
const router = express.Router();
const recomendacionController = require('../controllers/recomendacionController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');

router.post('/', verificarToken, recomendacionController.createRecomendacion);

module.exports = router;
