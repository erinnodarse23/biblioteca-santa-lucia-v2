const pool = require('../config/db');

const findAll = async () => {
    const { rows } = await pool.query('SELECT * FROM usuario ORDER BY id_usuario');
    return rows;
};

const findById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
    return rows[0] || null;
};

const findByEmail = async (email) => {
    const { rows } = await pool.query(
        'SELECT * FROM usuario WHERE LOWER(email) = LOWER($1)',
        [email]
    );
    return rows[0] || null;
};

const create = async ({ nombre, apellido, email, direccion }) => {
    const { rows } = await pool.query(
        `INSERT INTO usuario (nombre, apellido, email, direccion)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [nombre, apellido, email, direccion || null]
    );
    return rows[0];
};

const update = async (id, { nombre, apellido, email, direccion }) => {
    const { rows } = await pool.query(
        `UPDATE usuario
         SET nombre = $1, apellido = $2, email = $3, direccion = $4
         WHERE id_usuario = $5
         RETURNING *`,
        [nombre, apellido, email, direccion || null, id]
    );
    return rows[0] || null;
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM usuario WHERE id_usuario = $1', [id]);
    return rowCount > 0;
};
const findUsuariosConVencidos = async () => {
    const { rows } = await pool.query(
        `SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.email,
            COUNT(p.id_prestamo) AS prestamos_vencidos
         FROM usuario u
         INNER JOIN prestamo p ON u.id_usuario = p.id_usuario
         WHERE p.fecha_devolucion_prevista < CURRENT_DATE
           AND p.fecha_devolucion_real IS NULL
         GROUP BY u.id_usuario, u.nombre, u.apellido, u.email
         ORDER BY prestamos_vencidos DESC`
    );
    return rows;
};
module.exports = { findAll, findById, findByEmail, create, update, remove, findUsuariosConVencidos };