const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async(req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    };

    // Extraer email y password
    const { email, password } = req.body;
    
    try {

        // Revisar si el usuario registrado ya existe y es único

        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe'});
        };

        // Crea usuario
        usuario = new Usuario(req.body);

        // Hashear password
        const salt = await bcryptjs.genSalt(10); // Número unico para cada password
        usuario.password = await bcryptjs.hash(password, salt); 

        // Guardar usuario
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if( error ) throw error;

            // Mensaje de confirmación
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ocurrió un error'});
        next();
    };
};
