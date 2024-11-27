const express = require('express');
const router = require('./app/Controllers/router'); 
const PORT = 3000;
const app = express();
const cors = require('cors');
const connectToDatabase = require('./app/Data/db'); // Importar conexión a MongoDB
const productRoutes = require('./app/Controllers/productRoutes'); 
const orderRoutes = require('./app/Controllers/orderRoutes'); // Ruta para órdenes
const meseroRoutes = require('./app/Controllers/meseroRoutes');
const historialRoutes = require('./app/Controllers/historialRoutes');

app.use(express.json());
app.use(router);
app.use(cors());
app.use(express.static('app'));
app.use('/Views', express.static('Views'));


connectToDatabase();

app.use('/api/products', productRoutes);
app.use('/api/users', meseroRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/orders', orderRoutes); // Usar la ruta

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
