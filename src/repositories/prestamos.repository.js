const pool = require('../config/db');

const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
                l.titulo AS libro_titulo
         FROM prestamo p
         LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
         LEFT JOIN libro l ON p.isbn = l.isbn
         ORDER BY p.fecha_salida DESC`
    );
    return rows;
};

const findById = async (id) => {
    const { rows } = await pool.query(
        `SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
                l.titulo AS libro_titulo
         FROM prestamo p
         LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
         LEFT JOIN libro l ON p.isbn = l.isbn
         WHERE p.id_prestamo = $1`,
        [id]
    );
    return rows[0] || null;
};

const countActivosByUsuario = async (idUsuario) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) AS total FROM prestamo
         WHERE id_usuario = $1 AND fecha_devolucion_real IS NULL`,
        [idUsuario]
    );
    return parseInt(rows[0].total);
};

const countVencidosByUsuario = async (idUsuario) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) AS total FROM prestamo
         WHERE id_usuario = $1
           AND fecha_devolucion_prevista < CURRENT_DATE
           AND fecha_devolucion_real IS NULL`,
        [idUsuario]
    );
    return parseInt(rows[0].total);
};

const countActivosByLibro = async (isbn) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) AS total FROM prestamo
         WHERE isbn = $1 AND fecha_devolucion_real IS NULL`,
        [isbn]
    );
    return parseInt(rows[0].total);
};

const create = async ({ idUsuario, isbn, diasPrestamo }) => {
    const { rows } = await pool.query(
        `INSERT INTO prestamo (fecha_salida, fecha_devolucion_prevista, id_usuario, isbn)
         VALUES (CURRENT_DATE, CURRENT_DATE + $1::int, $2, $3)
         RETURNING *`,
        [diasPrestamo, idUsuario, isbn]
    );
    return rows[0];
};

const registrarDevolucion = async (id) => {
    const { rows } = await pool.query(
        `UPDATE prestamo
         SET fecha_devolucion_real = CURRENT_DATE
         WHERE id_prestamo = $1 AND fecha_devolucion_real IS NULL
         RETURNING *`,
        [id]
    );
    return rows[0] || null;
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM prestamo WHERE id_prestamo = $1', [id]);
    return rowCount > 0;
};

const findByLibroAndRango = async (isbn, fechaIni, fechaFin) => {
    const { rows } = await pool.query(
        `SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
         FROM prestamo p
         LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
         WHERE p.isbn = $1
           AND p.fecha_salida BETWEEN $2 AND $3
         ORDER BY p.fecha_salida`,
        [isbn, fechaIni, fechaFin]
    );
    return rows;
};

module.exports = {
    findAll,
    findById,
    countActivosByUsuario,
    countVencidosByUsuario,
    countActivosByLibro,
    create,
    registrarDevolucion,
    remove,
    findByLibroAndRango,
};