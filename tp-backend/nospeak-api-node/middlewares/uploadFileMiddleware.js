const multer = require('multer');

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para manejar la carga de archivos y generar el enlace de la imagen
const uploadProfilePicture = upload.single('profilePhoto');

const generateProfilePictureLink = (req, res, next) => {
  if (req.file) {
    if (req.body.name){
      console.log(req.body.name);
      const userName = req.body.name;
      req.body.picture = `https://i.pravatar.cc/150?u=${userName}`;
    }
    else{
      console.log("No name");
      req.body.picture = `https://picsum.photos/id/11/200/300`;
    }
    // Eliminar la foto de memoria
    req.file.buffer = null;
  }
  else{
    console.log("No file");
    req.body.picture = `https://picsum.photos/id/1/200/300`;
  }
  next();
};

module.exports = {
  uploadProfilePicture,
  generateProfilePictureLink,
};
