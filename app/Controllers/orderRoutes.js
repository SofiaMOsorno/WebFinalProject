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

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.delete('/:tableNumber', async (req, res) => {
    try {
        const { tableNumber } = req.params;  // Obtenemos el número de mesa de los parámetros de la URL

        // Buscamos la orden por el número de mesa
        const deletedOrder = await Order.findOneAndDelete({ tableNumber: tableNumber });

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada para el número de mesa especificado' });
        }

        res.status(200).json({ message: 'Orden eliminada exitosamente', tableNumber: deletedOrder.tableNumber });
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
module.exports = router;