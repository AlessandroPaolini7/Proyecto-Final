const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyRole(req, res, next) {
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
    // Verificar si el usuario tiene el campo isAdmin en true
    if (req.user && req.user.isAdmin) {
        // Si es administrador, continuar con la solicitud
        next();
      } else {
        // Si no es administrador, devolver un error
        res.status(403).json({ mensaje: 'Unauthorized access. Admin permissions are needed.' });
      }
  });
}

module.exports = verifyRole;










 