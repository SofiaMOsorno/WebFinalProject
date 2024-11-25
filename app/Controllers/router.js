const express = require('express');
const path = require('path');
const router = express.Router();



// Ruta para servir el HTML
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/inicio.html")));
router.get('/inicio', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/inicio.html")));
router.get('/mesero1', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/mesero1.html")));
router.get('/mesero2', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/mesero2.html")));
router.get('/mesero3', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/mesero3.html")));
router.get('/mesero4', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/mesero4.html")));
router.get('/MenuView', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/MenuView.html")));
router.get('/meseros', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/meseros.html")));
router.use('/Controllers', express.static('app/Controllers'));
router.get('/order', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/orden.html")));
router.get('/admin', (req, res) => res.sendFile(path.resolve(__dirname + "/../Views/admin.html")));


 module.exports = router;