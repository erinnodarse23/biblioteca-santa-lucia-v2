const express = require('express');
const { body, param, query } = require('express-validator');
const controller = require('../controllers/libros.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Listar todos los libros
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros con autor y género
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /api/libros/{isbn}/detalle:
 *   get:
 *     summary: Obtener detalle completo de un libro
 *     description: Incluye autor, género, calificación promedio, total de reseñas y copias disponibles
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN del libro (13 dígitos)
 *     responses:
 *       200:
 *         description: Detalle completo del libro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isbn: { type: string, example: '9788437604947' }
 *                 titulo: { type: string, example: 'Cien años de soledad' }
 *                 autor_nombre: { type: string, example: 'Gabriel' }
 *                 autor_apellido: { type: string, example: 'García Márquez' }
 *                 genero_nombre: { type: string, example: 'Realismo mágico' }
 *                 promedio_calificacion: { type: number, example: 4.5 }
 *                 total_resenas: { type: integer, example: 2 }
 *                 copias_disponibles: { type: integer, example: 3 }
 *       404:
 *         description: Libro no encontrado
 */
router.get(
    '/:isbn/detalle',
    [param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos')],
    validate,
    controller.obtenerDetalleCompleto
);

/**
 * @swagger
 * /api/libros/{isbn}/prestamos:
 *   get:
 *     summary: Consultar préstamos de un libro por rango de fechas
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaIni
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de préstamos en el rango
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: Rango de fechas inválido
 *       404:
 *         description: Libro no encontrado
 */
router.get(
    '/:isbn/prestamos',
    [
        param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
        query('fechaIni').isISO8601().withMessage('fechaIni inválida (YYYY-MM-DD)'),
        query('fechaFin').isISO8601().withMessage('fechaFin inválida (YYYY-MM-DD)'),
    ],
    validate,
    controller.listarPrestamosPorRango
);

/**
 * @swagger
 * /api/libros/{isbn}:
 *   get:
 *     summary: Obtener un libro por ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN del libro (13 dígitos)
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: Libro no encontrado
 */
router.get(
    '/:isbn',
    [param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos')],
    validate,
    controller.obtener
);

/**
 * @swagger
 * /api/libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isbn, titulo, cantidadEjemplares, idAutor, idGenero]
 *             properties:
 *               isbn: { type: string, example: '9788437604947' }
 *               titulo: { type: string, example: 'Cien años de soledad' }
 *               fechaPublicacion: { type: string, format: date, example: '1967-05-30' }
 *               numPaginas: { type: integer, example: 432 }
 *               cantidadEjemplares: { type: integer, example: 5 }
 *               sintesis: { type: string, example: 'Novela del realismo mágico' }
 *               idAutor: { type: integer, example: 1 }
 *               idGenero: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Libro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Autor o género no encontrado
 *       409:
 *         description: Ya existe un libro con ese ISBN
 */
router.post(
    '/',
    [
        body('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
        body('titulo').notEmpty().withMessage('El título es obligatorio')
            .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
        body('fechaPublicacion').optional({ nullable: true }).isISO8601().withMessage('Fecha inválida (YYYY-MM-DD)'),
        body('numPaginas').optional({ nullable: true }).isInt({ min: 1 }).withMessage('numPaginas debe ser mayor a 0'),
        body('cantidadEjemplares').isInt({ min: 0 }).withMessage('cantidadEjemplares debe ser >= 0'),
        body('sintesis').optional().isString(),
        body('idAutor').isInt({ min: 1 }).withMessage('idAutor debe ser un entero positivo'),
        body('idGenero').isInt({ min: 1 }).withMessage('idGenero debe ser un entero positivo'),
    ],
    validate,
    controller.crear
);

/**
 * @swagger
 * /api/libros/{isbn}:
 *   put:
 *     summary: Actualizar un libro existente
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, cantidadEjemplares, idAutor, idGenero]
 *             properties:
 *               titulo: { type: string }
 *               fechaPublicacion: { type: string, format: date }
 *               numPaginas: { type: integer }
 *               cantidadEjemplares: { type: integer }
 *               sintesis: { type: string }
 *               idAutor: { type: integer }
 *               idGenero: { type: integer }
 *     responses:
 *       200:
 *         description: Libro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: Libro no encontrado
 */
router.put(
    '/:isbn',
    [
        param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
        body('titulo').notEmpty().isLength({ max: 200 }),
        body('fechaPublicacion').optional({ nullable: true }).isISO8601(),
        body('numPaginas').optional({ nullable: true }).isInt({ min: 1 }),
        body('cantidadEjemplares').isInt({ min: 0 }),
        body('sintesis').optional().isString(),
        body('idAutor').isInt({ min: 1 }),
        body('idGenero').isInt({ min: 1 }),
    ],
    validate,
    controller.actualizar
);

/**
 * @swagger
 * /api/libros/{isbn}:
 *   delete:
 *     summary: Eliminar un libro
 *     description: Al eliminar un libro también se eliminan sus préstamos y reseñas asociados (CASCADE)
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Libro eliminado
 *       404:
 *         description: Libro no encontrado
 */
router.delete(
    '/:isbn',
    [param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos')],
    validate,
    controller.eliminar
);

module.exports = router;