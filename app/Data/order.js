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
});

module.exports = mongoose.model('Order', orderSchema, 'orders');