const pool = require('../config/db');

const findAll = async () => {
    const { rows } = await pool.query('SELECT * FROM genero ORDER BY id_genero');
    return rows;
};

const findById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM genero WHERE id_genero = $1', [id]);
    return rows[0] || null;
};

const create = async ({ nombre, descripcion }) => {
    const { rows } = await pool.query(
        `INSERT INTO genero (nombre, descripcion)
         VALUES ($1, $2)
         RETURNING *`,
        [nombre, descripcion || null]
    );
    return rows[0];
};

const update = async (id, { nombre, descripcion }) => {
    const { rows } = await pool.query(
        `UPDATE genero
         SET nombre = $1, descripcion = $2
         WHERE id_genero = $3
         RETURNING *`,
        [nombre, descripcion || null, id]
    );
    return rows[0] || null;
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM genero WHERE id_genero = $1', [id]);
    return rowCount > 0;
};
const findByNombre = async (nombre) => {
    const { rows } = await pool.query(
        'SELECT * FROM genero WHERE LOWER(nombre) = LOWER($1)',
        [nombre]
    );
    return rows[0] || null;
};
module.exports = { findAll, findById, findByNombre, create, update, remove };

