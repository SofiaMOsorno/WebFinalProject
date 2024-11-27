const express = require('express');
const Historial = require('../Data/historialModel'); // Importar el modelo de historial

const router = express.Router();

// Ruta para cerrar un pedido y guardarlo en el historial
router.post('/', async (req, res) => {
    try {
        const { products, tableNumber } = req.body;

        const historial = new Historial({
            products,
            tableNumber,
            date: new Date(), // Asignar fecha actual si no está incluida
        });

        const savedHistorial = await historial.save();

        res.status(201).json({
            message: 'Pedido cerrado y guardado en el historial',
            historialId: savedHistorial._id,
        });
    } catch (error) {
        console.error('Error al guardar en el historial:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;