require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    
    // Probar conexión a PostgreSQL
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('❌ Error al conectar a PostgreSQL:', err.message);
        } else {
            console.log('✅ PostgreSQL conectado:', res.rows[0].now);
        }
    });
});