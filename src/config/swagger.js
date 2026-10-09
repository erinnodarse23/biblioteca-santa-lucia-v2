const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Biblioteca Santa Lucía',
            version: '1.0.0',
            description: 'API REST para la gestión de préstamos, devoluciones y reseñas de la Biblioteca Santa Lucía.',
            contact: {
                name: 'Erin Odarse',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            schemas: {
                Autor: {
                    type: 'object',
                    properties: {
                        id_autor: { type: 'integer', example: 1 },
                        nombre: { type: 'string', example: 'Gabriel' },
                        apellido: { type: 'string', example: 'García Márquez' },
                        fecha_nacimiento: { type: 'string', format: 'date', example: '1927-03-06' },
                        nacionalidad: { type: 'string', example: 'Colombiana' },
                        biografia: { type: 'string', example: 'Premio Nobel de Literatura 1982' },
                    },
                },
                Genero: {
                    type: 'object',
                    properties: {
                        id_genero: { type: 'integer', example: 1 },
                        nombre: { type: 'string', example: 'Realismo mágico' },
                        descripcion: { type: 'string', example: 'Género literario que incorpora elementos fantásticos' },
                    },
                },
                Libro: {
                    type: 'object',
                    properties: {
                        isbn: { type: 'string', example: '9788437604947' },
                        titulo: { type: 'string', example: 'Cien años de soledad' },
                        fecha_publicacion: { type: 'string', format: 'date', example: '1967-05-30' },
                        num_paginas: { type: 'integer', example: 432 },
                        cantidad_ejemplares: { type: 'integer', example: 5 },
                        sintesis: { type: 'string', example: 'Novela del realismo mágico' },
                        id_autor: { type: 'integer', example: 1 },
                        id_genero: { type: 'integer', example: 1 },
                    },
                },
                Usuario: {
                    type: 'object',
                    properties: {
                        id_usuario: { type: 'integer', example: 1 },
                        nombre: { type: 'string', example: 'Ana' },
                        apellido: { type: 'string', example: 'Pérez' },
                        email: { type: 'string', format: 'email', example: 'ana@example.com' },
                        direccion: { type: 'string', example: 'Calle 23 #456, La Habana' },
                    },
                },
                Prestamo: {
                    type: 'object',
                    properties: {
                        id_prestamo: { type: 'integer', example: 1 },
                        fecha_salida: { type: 'string', format: 'date', example: '2026-10-01' },
                        fecha_devolucion_prevista: { type: 'string', format: 'date', example: '2026-10-15' },
                        fecha_devolucion_real: { type: 'string', format: 'date', nullable: true, example: null },
                        id_usuario: { type: 'integer', example: 1 },
                        isbn: { type: 'string', example: '9788437604947' },
                    },
                },
                Resena: {
                    type: 'object',
                    properties: {
                        id_resena: { type: 'integer', example: 1 },
                        calificacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                        comentario: { type: 'string', example: 'Excelente libro, muy recomendado' },
                        fecha_publicacion: { type: 'string', format: 'date', example: '2026-10-08' },
                        id_usuario: { type: 'integer', example: 1 },
                        isbn: { type: 'string', example: '9788437604947' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Recurso no encontrado' },
                        message: { type: 'string', example: 'Autor no encontrado' },
                        status: { type: 'integer', example: 404 },
                        timestamp: { type: 'string', example: '2026-10-08T12:00:00.000Z' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;