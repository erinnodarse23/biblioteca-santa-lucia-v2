const pool = require('../config/db');

const findAll = async () => {
    const { rows } = await pool.query('SELECT * FROM autor ORDER BY id_autor');
    return rows;
};

const findById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM autor WHERE id_autor = $1', [id]);
    return rows[0] || null;
};

const create = async ({ nombre, apellido, fechaNacimiento, nacionalidad, biografia }) => {
    const { rows } = await pool.query(
        `INSERT INTO autor (nombre, apellido, fecha_nacimiento, nacionalidad, biografia)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [nombre, apellido, fechaNacimiento || null, nacionalidad || null, biografia || null]
    );
    return rows[0];
};

const update = async (id, { nombre, apellido, fechaNacimiento, nacionalidad, biografia }) => {
    const { rows } = await pool.query(
        `UPDATE autor
         SET nombre = $1, apellido = $2, fecha_nacimiento = $3,
             nacionalidad = $4, biografia = $5
         WHERE id_autor = $6
         RETURNING *`,
        [nombre, apellido, fechaNacimiento || null, nacionalidad || null, biografia || null, id]
    );
    return rows[0] || null;
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM autor WHERE id_autor = $1', [id]);
    return rowCount > 0;
};
const findByNombreApellido = async (nombre, apellido) => {
    const { rows } = await pool.query(
        'SELECT * FROM autor WHERE LOWER(nombre) = LOWER($1) AND LOWER(apellido) = LOWER($2)',
        [nombre, apellido]
    );
    return rows[0] || null;
};

module.exports = { findAll, findById, findByNombreApellido, create, update, remove };