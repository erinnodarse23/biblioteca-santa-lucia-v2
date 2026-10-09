const pool = require('../config/db');

const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT l.*, a.nombre AS autor_nombre, a.apellido AS autor_apellido,
                g.nombre AS genero_nombre
         FROM libro l
         LEFT JOIN autor a ON l.id_autor = a.id_autor
         LEFT JOIN genero g ON l.id_genero = g.id_genero
         ORDER BY l.titulo`
    );
    return rows;
};

const findByIsbn = async (isbn) => {
    const { rows } = await pool.query(
        `SELECT l.*, a.nombre AS autor_nombre, a.apellido AS autor_apellido,
                g.nombre AS genero_nombre
         FROM libro l
         LEFT JOIN autor a ON l.id_autor = a.id_autor
         LEFT JOIN genero g ON l.id_genero = g.id_genero
         WHERE l.isbn = $1`,
        [isbn]
    );
    return rows[0] || null;
};

const create = async ({ isbn, titulo, fechaPublicacion, numPaginas, cantidadEjemplares, sintesis, idAutor, idGenero }) => {
    const { rows } = await pool.query(
        `INSERT INTO libro (isbn, titulo, fecha_publicacion, num_paginas, cantidad_ejemplares, sintesis, id_autor, id_genero)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [isbn, titulo, fechaPublicacion || null, numPaginas || null, cantidadEjemplares, sintesis || null, idAutor, idGenero]
    );
    return rows[0];
};

const update = async (isbn, { titulo, fechaPublicacion, numPaginas, cantidadEjemplares, sintesis, idAutor, idGenero }) => {
    const { rows } = await pool.query(
        `UPDATE libro
         SET titulo = $1, fecha_publicacion = $2, num_paginas = $3,
             cantidad_ejemplares = $4, sintesis = $5, id_autor = $6, id_genero = $7
         WHERE isbn = $8
         RETURNING *`,
        [titulo, fechaPublicacion || null, numPaginas || null, cantidadEjemplares, sintesis || null, idAutor, idGenero, isbn]
    );
    return rows[0] || null;
};

const remove = async (isbn) => {
    const { rowCount } = await pool.query('DELETE FROM libro WHERE isbn = $1', [isbn]);
    return rowCount > 0;
};

// Detalle completo con promedio, total de reseñas y copias disponibles
const findDetalleCompleto = async (isbn) => {
    const { rows } = await pool.query(
        `SELECT 
            l.isbn,
            l.titulo,
            l.fecha_publicacion,
            l.num_paginas,
            l.cantidad_ejemplares,
            l.sintesis,
            a.nombre AS autor_nombre,
            a.apellido AS autor_apellido,
            g.nombre AS genero_nombre,
            COALESCE(AVG(r.calificacion), 0) AS promedio_calificacion,
            COUNT(r.id_resena) AS total_resenas,
            (l.cantidad_ejemplares - COUNT(p.id_prestamo) FILTER (WHERE p.fecha_devolucion_real IS NULL)) AS copias_disponibles
         FROM libro l
         LEFT JOIN autor a ON l.id_autor = a.id_autor
         LEFT JOIN genero g ON l.id_genero = g.id_genero
         LEFT JOIN resena r ON l.isbn = r.isbn
         LEFT JOIN prestamo p ON l.isbn = p.isbn
         WHERE l.isbn = $1
         GROUP BY l.isbn, a.nombre, a.apellido, g.nombre`,
        [isbn]
    );
    return rows[0] || null;
};

module.exports = { findAll, findByIsbn, create, update, remove, findDetalleCompleto };