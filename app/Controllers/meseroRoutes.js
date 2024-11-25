const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Data/meseroModel');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { nombre, password } = req.body;

    try {
        const user = await User.findOne({ nombre });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar el inicio de sesión', error });
    }
});

router.post('/register', async (req, res) => {
    const { nombre, password, edad, puesto, perfil, numeroMesero } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            nombre,
            password: hashedPassword,
            edad,
            puesto,
            perfil,
            numeroMesero,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Usuario registrado', user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

module.exports = router;