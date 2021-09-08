const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoControllers');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear un usuario => api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// Obtienen todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

// Actualizr un proyecto via id
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// Eliminar Proyecto por id
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;