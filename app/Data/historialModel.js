const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
    products: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    tableNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 24,
    },
});

module.exports = mongoose.model('Historial', historialSchema, 'historial');