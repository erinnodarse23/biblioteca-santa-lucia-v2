const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Biblioteca Santa Lucía funcionando 🚀' });
});

// Rutas
app.use('/api/autores', require('./routes/autores.routes'));
app.use('/api/generos', require('./routes/generos.routes'));
app.use('/api/libros', require('./routes/libros.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/prestamos', require('./routes/prestamos.routes'));
app.use('/api/resenas', require('./routes/resenas.routes'));
// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
});

// Errores
app.use(errorHandler);

module.exports = app;