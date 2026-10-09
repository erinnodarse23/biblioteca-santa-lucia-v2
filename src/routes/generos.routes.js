const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/generos.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/generos:
 *   get:
 *     summary: Listar todos los géneros
 *     tags: [Generos]
 *     responses:
 *       200:
 *         description: Lista de géneros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genero'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /api/generos/{id}:
 *   get:
 *     summary: Obtener un género por ID
 *     tags: [Generos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género
 *     responses:
 *       200:
 *         description: Género encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genero'
 *       404:
 *         description: Género no encontrado
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
 * /api/generos:
 *   post:
 *     summary: Crear un nuevo género
 *     tags: [Generos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Realismo mágico
 *               descripcion:
 *                 type: string
 *                 example: Género literario que incorpora elementos fantásticos a la realidad
 *     responses:
 *       201:
 *         description: Género creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genero'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe un género con ese nombre
 */
router.post(
    '/',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio')
            .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
        body('descripcion').optional().isString(),
    ],
    validate,
    controller.crear
);

/**
 * @swagger
 * /api/generos/{id}:
 *   put:
 *     summary: Actualizar un género existente
 *     tags: [Generos]
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
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string, example: Realismo mágico }
 *               descripcion: { type: string, example: Corriente literaria del siglo XX }
 *     responses:
 *       200:
 *         description: Género actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genero'
 *       404:
 *         description: Género no encontrado
 *       409:
 *         description: Ya existe otro género con ese nombre
 */
router.put(
    '/:id',
    [
        param('id').isInt({ min: 1 }),
        body('nombre').notEmpty().isLength({ max: 50 }),
        body('descripcion').optional().isString(),
    ],
    validate,
    controller.actualizar
);

/**
 * @swagger
 * /api/generos/{id}:
 *   delete:
 *     summary: Eliminar un género
 *     tags: [Generos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Género eliminado
 *       404:
 *         description: Género no encontrado
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