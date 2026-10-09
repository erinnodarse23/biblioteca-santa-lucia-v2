const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/autores.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/autores:
 *   get:
 *     summary: Listar todos los autores
 *     tags: [Autores]
 *     responses:
 *       200:
 *         description: Lista de autores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autor'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /api/autores/{id}:
 *   get:
 *     summary: Obtener un autor por ID
 *     tags: [Autores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autor
 *     responses:
 *       200:
 *         description: Autor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       404:
 *         description: Autor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    '/:id',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.obtener
);

/**
 * @swagger
 * /api/autores:
 *   post:
 *     summary: Crear un nuevo autor
 *     tags: [Autores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Gabriel
 *               apellido:
 *                 type: string
 *                 example: García Márquez
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: '1927-03-06'
 *               nacionalidad:
 *                 type: string
 *                 example: Colombiana
 *               biografia:
 *                 type: string
 *                 example: Premio Nobel de Literatura 1982
 *     responses:
 *       201:
 *         description: Autor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Autor duplicado
 */
router.post(
    '/',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio')
            .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
        body('apellido').notEmpty().withMessage('El apellido es obligatorio')
            .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
        body('fechaNacimiento').optional().isISO8601().withMessage('Fecha inválida (YYYY-MM-DD)'),
        body('nacionalidad').optional().isLength({ max: 50 }),
        body('biografia').optional().isString(),
    ],
    validate,
    controller.crear
);

/**
 * @swagger
 * /api/autores/{id}:
 *   put:
 *     summary: Actualizar un autor existente
 *     tags: [Autores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido]
 *             properties:
 *               nombre: { type: string }
 *               apellido: { type: string }
 *               fechaNacimiento: { type: string, format: date }
 *               nacionalidad: { type: string }
 *               biografia: { type: string }
 *     responses:
 *       200:
 *         description: Autor actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       404:
 *         description: Autor no encontrado
 */
router.put(
    '/:id',
    [
        param('id').isInt({ min: 1 }),
        body('nombre').notEmpty().isLength({ max: 50 }),
        body('apellido').notEmpty().isLength({ max: 50 }),
        body('fechaNacimiento').optional().isISO8601(),
        body('nacionalidad').optional().isLength({ max: 50 }),
        body('biografia').optional().isString(),
    ],
    validate,
    controller.actualizar
);

/**
 * @swagger
 * /api/autores/{id}:
 *   delete:
 *     summary: Eliminar un autor
 *     tags: [Autores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Autor eliminado
 *       404:
 *         description: Autor no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene libros asociados
 */
router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;