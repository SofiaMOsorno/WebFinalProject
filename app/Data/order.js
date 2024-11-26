const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
        max: 24
    }
});

// Método estático para generar un número de mesa aleatorio
orderSchema.statics.generateRandomTableNumber = function() {
    return Math.floor(Math.random() * 24) + 1;
};

// Hook pre-save para asignar mesa si no se ha especificado
orderSchema.pre('save', function(next) {
    if (!this.tableNumber) {
        this.tableNumber = this.constructor.generateRandomTableNumber();
    }
    next();
});

// Método para verificar si un número de mesa es válido
orderSchema.statics.isValidTableNumber = function(tableNumber) {
    return tableNumber >= 1 && tableNumber <= 24;
};

module.exports = mongoose.model('Order', orderSchema, 'orders');