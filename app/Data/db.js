// db.js
const mongoose = require('mongoose');

const mongoConnection = "mongodb+srv://admin:CrossBeast78@myapp.shaxq.mongodb.net/products";

const connectToDatabase = async () => {
    mongoose.connection.on('connecting', () => {
        console.log('Conectando a MongoDB...');
        console.log(mongoose.connection.readyState);
    });

    mongoose.connection.on('connected', () => {
        console.log('¡Conectado exitosamente a MongoDB!');
        console.log(mongoose.connection.readyState);
    });

    try {
        await mongoose.connect(mongoConnection)
        .catch((error) => console.error('Error al conectar a MongoDB:', error));
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};

module.exports = connectToDatabase;