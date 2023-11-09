// auth/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://frontenddd-production.up.railway.app', 'https://backendauth-production.up.railway.app', 'http://localhost:5173', 'http://localhost:7000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
/* usar: Access-Control-Allow-Origin */

app.use(express.urlencoded({ extended: true }));

//Como hostear react directo desde express? Asi --> 
//Primero le decimos a express que use todos los archivos del build de react asi:
app.use(express.static(
  path.join(__dirname, "../../frontend/build")
));
//Luego le decimos a express que sirva todo eso desde el home
app.get("/", (req, res) => {
  res.sendFile(path.join(
      __dirname, "../../frontend/build/index.html"
  ))
});

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Puerto de escucha
const port = /* process.env.PORT ||  */7000;
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
