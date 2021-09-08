const Tarea = require("../models/Tarea");
const Proyecto = require('../models/Proyectos');
const { validationResult } = require('express-validator');

// Crear Tarea
exports.crearTarea = async (req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    };
    
    try {

        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        
        const existepProyecto = await Proyecto.findById(proyecto);
        if(!existepProyecto){
            return res.status(404).json({msg: 'El proyecto no existe'});
        }

        // Revisar si el proyecto pretenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Ocurrió un error'});
    };   
};

//Obtener tareas por proyecto
exports.obtenerTareas = async (req, res, next) => {

    try {

        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
        
        const existepProyecto = await Proyecto.findById(proyecto);
        if(!existepProyecto){
            return res.status(404).json({msg: 'El proyecto no existe'});
        }

        // Revisar si el proyecto pretenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Obtener las tareas del proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });

        res.json({tareas});
        

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    };
};

// Actualizar tarea mediante un id

exports.actualizarTarea = async (req, res, next) => {

    try {

        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // Comprobar si la tarea existe o no
        let existeTarea = await Tarea.findById( req.params.id );
        if(!existeTarea) {
            return res.status(404).json({ msg: 'La tarea no existe'});
        }
        
        // Extraer proyecto
        const existepProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto pretenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
            
        }

        // Crear un objeto con la nueva información
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        // Guardar la tarea
        existeTarea = await Tarea.findOneAndUpdate({_id : req.params.id }, nuevaTarea, { new: true});
        res.json({existeTarea});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error'});
    };
};

exports.eliminarTarea = async (req, res, next) => {

    try {
        
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        // Comprobar si la tarea existe o no
        let existeTarea = await Tarea.findById( req.params.id );
        if(!existeTarea) {
            return res.status(404).json({ msg: 'La tarea no existe'});
        }
        
        // Extraer proyecto
        const existepProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto pretenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
            
        }

        // Eliminamos la tare

        await Tarea.findOneAndRemove({ _id: req.params.id});
        res.json({msg: 'Tarea eliminada correctamente'});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
