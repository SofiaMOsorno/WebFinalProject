const express = require('express');
const Order = require('../Data/order'); // Importar el modelo de órdenes
const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', async (req, res) => {
    try {
        const { products, date, tableNumber } = req.body;

        // Validar número de mesa si se proporciona
        if (tableNumber && (tableNumber < 1 || tableNumber > 24)) {
            return res.status(400).json({ message: 'Número de mesa inválido' });
        }

        const order = new Order({
            products,
            date: date || new Date(),
            tableNumber: tableNumber || Order.generateRandomTableNumber() // Usar método del modelo
        });

        const savedOrder = await order.save();

        res.status(201).json({
            message: 'Orden creada exitosamente',
            orderId: savedOrder._id,
            tableNumber: savedOrder.tableNumber
        });
    } catch (error) {
        console.error('Error al guardar la orden:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;