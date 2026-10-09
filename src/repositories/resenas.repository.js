const pool = require('../config/db');

const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT r.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
                l.titulo AS libro_titulo
         FROM resena r
         LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
         LEFT JOIN libro l ON r.isbn = l.isbn
         ORDER BY r.fecha_publicacion DESC`
    );
    return rows;
};

const findById = async (id) => {
    const { rows } = await pool.query(
        `SELECT r.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
                l.titulo AS libro_titulo
         FROM resena r
         LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
         LEFT JOIN libro l ON r.isbn = l.isbn
         WHERE r.id_resena = $1`,
        [id]
    );
    return rows[0] || null;
};

const findByUsuarioAndLibro = async (idUsuario, isbn) => {
    const { rows } = await pool.query(
        'SELECT * FROM resena WHERE id_usuario = $1 AND isbn = $2',
        [idUsuario, isbn]
    );
    return rows[0] || null;
};

const create = async ({ idUsuario, isbn, calificacion, comentario }) => {
    const { rows } = await pool.query(
        `INSERT INTO resena (calificacion, comentario, fecha_publicacion, id_usuario, isbn)
         VALUES ($1, $2, CURRENT_DATE, $3, $4)
         RETURNING *`,
        [calificacion, comentario || null, idUsuario, isbn]
    );
    return rows[0];
};

const update = async (id, { calificacion, comentario }) => {
    const { rows } = await pool.query(
        `UPDATE resena
         SET calificacion = $1, comentario = $2
         WHERE id_resena = $3
         RETURNING *`,
        [calificacion, comentario || null, id]
    );
    return rows[0] || null;
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM resena WHERE id_resena = $1', [id]);
    return rowCount > 0;
};

// Verifica si el usuario tiene al menos un préstamo devuelto de ese libro
const tienePrestamoDevuelto = async (idUsuario, isbn) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) AS total FROM prestamo
         WHERE id_usuario = $1 AND isbn = $2 AND fecha_devolucion_real IS NOT NULL`,
        [idUsuario, isbn]
    );
    return parseInt(rows[0].total) > 0;
};

module.exports = {
    findAll,
    findById,
    findByUsuarioAndLibro,
    create,
    update,
    remove,
    tienePrestamoDevuelto,
};