const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/resenas.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/resenas:
 *   get:
 *     summary: Listar todas las reseñas
 *     tags: [Resenas]
 *     responses:
 *       200:
 *         description: Lista de reseñas con datos del usuario y libro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resena'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /api/resenas/{id}:
 *   get:
 *     summary: Obtener una reseña por ID
 *     tags: [Resenas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resena'
 *       404:
 *         description: Reseña no encontrada
 */
router.get(
    '/:id',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.obtener
);

/**
 * @swagger
 * /api/resenas:
 *   post:
 *     summary: Crear una nueva reseña
 *     description: |
 *       Reglas de negocio:
 *       - El usuario debe existir.
 *       - El libro debe existir.
 *       - El usuario debe haber devuelto el libro antes de reseñarlo.
 *       - Un usuario solo puede reseñar una vez el mismo libro.
 *     tags: [Resenas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idUsuario, isbn, calificacion]
 *             properties:
 *               idUsuario: { type: integer, example: 1 }
 *               isbn: { type: string, example: '9788437604947' }
 *               calificacion: { type: integer, minimum: 1, maximum: 5, example: 5 }
 *               comentario: { type: string, example: 'Excelente libro, muy recomendado' }
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resena'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario o libro no encontrado
 *       409:
 *         description: El usuario no ha devuelto el libro o ya lo reseñó
 */
router.post(
    '/',
    [
        body('idUsuario').isInt({ min: 1 }).withMessage('idUsuario debe ser entero positivo'),
        body('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
        body('calificacion').isInt({ min: 1, max: 5 })
            .withMessage('La calificación debe estar entre 1 y 5'),
        body('comentario').optional().isLength({ max: 1000 })
            .withMessage('Máximo 1000 caracteres'),
    ],
    validate,
    controller.crear
);

/**
 * @swagger
 * /api/resenas/{id}:
 *   put:
 *     summary: Actualizar una reseña existente
 *     tags: [Resenas]
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
 *             required: [calificacion]
 *             properties:
 *               calificacion: { type: integer, minimum: 1, maximum: 5, example: 4 }
 *               comentario: { type: string, example: 'Reconsiderando, muy bueno' }
 *     responses:
 *       200:
 *         description: Reseña actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resena'
 *       404:
 *         description: Reseña no encontrada
 */
router.put(
    '/:id',
    [
        param('id').isInt({ min: 1 }),
        body('calificacion').isInt({ min: 1, max: 5 }),
        body('comentario').optional().isLength({ max: 1000 }),
    ],
    validate,
    controller.actualizar
);

/**
 * @swagger
 * /api/resenas/{id}:
 *   delete:
 *     summary: Eliminar una reseña
 *     tags: [Resenas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Reseña eliminada
 *       404:
 *         description: Reseña no encontrada
 */
router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;