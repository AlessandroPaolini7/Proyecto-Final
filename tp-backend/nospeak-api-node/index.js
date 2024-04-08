const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const config = require('./config');

mongoose.connect(config.databaseConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB Atlas establecida');
});

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
// agregado para que el servidor pueda recibir peticiones de origen local sin problemas de cors

app.use('/api', apiRoutes); 
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
