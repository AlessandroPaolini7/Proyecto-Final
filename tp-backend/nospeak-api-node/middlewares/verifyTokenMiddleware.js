const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  // Obtenemos el token desde las cabeceras
  const token = req.headers.authorization;
  // Comprobamos si no hay token
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Verificamos el token
  jwt.verify(token, config.tokenSecretKey, (error, user) => {
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Almacenamos el usuario en la petición
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
