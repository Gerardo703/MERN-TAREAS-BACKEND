const mongoose = require('mongoose');
require('dotenv').config({ path: '../variables.env' });

// Conectar DB

const conectarDB = async () => {

    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });  
        console.log('Base de datos conectada correctamente');
    } catch (error) {
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = conectarDB;

