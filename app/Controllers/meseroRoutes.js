const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Data/meseroModel');
const router = express.Router();

// Endpoint de Registro
router.post('/register', async (req, res) => {
    try {
        const { 
            nombre, 
            edad, 
            numeroMesero, 
            password, 
            puesto = 'Mesero', // Valor por defecto
            perfil 
        } = req.body;

        // Validaciones
        if (!nombre || !edad || !numeroMesero || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ 
            $or: [
                { nombre }, 
                { numeroMesero } 
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new User({
            nombre,
            password: hashedPassword,
            edad,
            puesto,
            perfil,
            numeroMesero
        });

        // Guardar en la base de datos
        await newUser.save();

        res.status(201).json({ 
            message: 'Registro exitoso',
            user: { 
                nombre: newUser.nombre, 
                numeroMesero: newUser.numeroMesero 
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            message: 'Error en el registro', 
            error: error.message 
        });
    }
});

// Endpoint de Login (/api/users/login)
router.post('/', async (req, res) => {
    try {
        const { numeroMesero, password } = req.body;

        // Validaciones
        if (!numeroMesero || !password) {
            return res.status(400).json({ message: 'Número de mesero y contraseña son obligatorios' });
        }

        // Buscar usuario
        const user = await User.findOne({ numeroMesero });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Login exitoso
        res.status(200).json({ 
            user: { 
                nombre: user.nombre, 
                numeroMesero: user.numeroMesero,
                puesto: user.puesto 
            }
        });
        //res.redirect('/meseros');

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error en el inicio de sesión', 
            error: error.message 
        });
    }
});

module.exports = router;