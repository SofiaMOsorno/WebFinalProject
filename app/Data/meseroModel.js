const mongoose = require('mongoose');

// Definición del esquema y modelo de usuario
const userSchema = mongoose.Schema({
    numeroMesero: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    puesto: {
        type: String,
        required: true
    },
    perfil: {
        type: String,
        required: true
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;