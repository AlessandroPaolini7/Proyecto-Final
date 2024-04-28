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
  origin: ['https://nospeak-client.vercel.app', 'http://localhost:3000'],
  credentials: true,
}));

app.use('/api', apiRoutes); 
const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, HOST, () => {
  console.log(`Servidor en funcionamiento en http://${HOST}:${PORT}`);
});
