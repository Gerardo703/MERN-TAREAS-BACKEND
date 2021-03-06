const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
// Crear servidor
const app = express();

// Habilitar Cors
app.use(cors());

// Conectar a la DB
conectarDB();

// Habilitar BODY-PARSER
app.use(express.json({ extended: true }));
app.use(express.urlencoded({
  extended: true
}));

// Puerto de la app
const port = process.env.PORT || 4000;

// Importar las rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Arrancar la app
app.listen( port, '0.0.0.0', () => {
    console.log(`Servidor ejecutandose correctamente en ${port}`);
})

