const Proyecto = require('../models/Proyectos');
const { validationResult } = require('express-validator');

// Crear un proyecto con un usuario
exports.crearProyecto = async (req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    };

    try {

        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // Guardamos el proyecto
        proyecto.save();
        res.json(proyecto);

        
    } catch (error) {
        console.log(error);
        res.status(500).json('Hubo un error');
    };
};

// Obtener todos los proyectos de un usuario 

exports.obtenerProyectos = async(req, res, next) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json(proyectos);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error'});
    }
}

// Actualizar un proyecto

exports.actualizarProyecto = async(req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    };

    // Extraer la info del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Revisar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'No existe el proyecto solicitado' });
        }

        // Revisar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Actualizar el proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    };
};

// Eliminar Proyecto por su id

exports.eliminarProyecto = async (req, res, next) => {
    
    try {

        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Revisar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'No existe el proyecto solicitado' });
        }

        // Revisar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: 'Proyecto Eliminado Correctamente'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }

}
