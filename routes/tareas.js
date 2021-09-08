const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaControllers');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear una tarea => api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener Tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// Actualizar Tarea por id
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

// Eliminar tarea por id
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;