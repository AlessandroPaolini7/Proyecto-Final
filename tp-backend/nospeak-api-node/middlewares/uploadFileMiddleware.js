const multer = require('multer');

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para manejar la carga de archivos y generar el enlace de la imagen
const uploadProfilePicture = upload.single('profilePhoto');

const generateProfilePictureLink = (req, res, next) => {
  if (req.file) {
    const userName = req.body.name;
    req.body.picture = `https://i.pravatar.cc/150?u=${userName}`;
  }
  next();
};

module.exports = {
  uploadProfilePicture,
  generateProfilePictureLink,
};
