// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioControllers = require('../controllers/usuarioControllers');
const { check } = require('express-validator');


// Crear un usuario => api/usuarios
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Revisa que no esté vacío el campo nombre
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 8 caracteres').isLength({ min: 6})
    ],
    usuarioControllers.crearUsuario
)


module.exports = router;