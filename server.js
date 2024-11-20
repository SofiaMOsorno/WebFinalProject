const express = require('express');
const router = require('./app/Controllers/router'); 
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(router);

app.use(express.static('app'));
app.use('/Views', express.static('Views'));

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
