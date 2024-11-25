const mongoose = require('mongoose');
const { generateUUID } = require('../Controllers/utils');

const productSchema = mongoose.Schema({
    _productUuid: { type: String, default: generateUUID, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;