const express = require('express');
const Order = require('../Data/order'); // Importar el modelo de órdenes
const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', async (req, res) => {
    try {
        const { products, date } = req.body;

        // Validar que los datos existan
        if (!products) {
            return res.status(400).json({ message: 'La orden debe incluir productos' });
        }

        // Crear y guardar la orden en la colección 'orders'
        const order = new Order({ products, date: date || new Date() });
        const savedOrder = await order.save();

        res.status(201).json({
            message: 'Orden creada exitosamente',
            orderId: savedOrder._id,
        });
    } catch (error) {
        console.error('Error al guardar la orden:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;