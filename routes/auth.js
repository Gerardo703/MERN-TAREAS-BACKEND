// Rutas de autenticación
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authControllers = require('../controllers/authControllers');
const auth = require('../../servidor/middleware/auth');

// Autenticar usuario => api/auth
router.post('/', 
    // [
    //     check('email', 'Agrega un email válido').isEmail(),
    //     check('password', 'El password debe ser minimo de 8 caracteres').isLength({ min: 6})
    // ],
    authControllers.autenticarUsuario
)

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authControllers.usuarioAutenticado
);

module.exports = router;