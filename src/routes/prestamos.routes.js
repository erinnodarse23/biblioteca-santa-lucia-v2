const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/prestamos.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/prestamos:
 *   get:
 *     summary: Listar todos los préstamos
 *     tags: [Prestamos]
 *     responses:
 *       200:
 *         description: Lista de préstamos con datos del usuario y libro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestamo'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   get:
 *     summary: Obtener un préstamo por ID
 *     tags: [Prestamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Préstamo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestamo'
 *       404:
 *         description: Préstamo no encontrado
 */
router.get(
    '/:id',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.obtener
);

/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Registrar un nuevo préstamo
 *     description: |
 *       Aplica las siguientes reglas de negocio:
 *       - El usuario debe existir.
 *       - El libro debe existir.
 *       - El usuario no puede tener más de 5 préstamos activos.
 *       - El usuario no puede tener préstamos vencidos.
 *       - El libro debe tener al menos un ejemplar disponible.
 *     tags: [Prestamos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idUsuario, isbn, diasPrestamo]
 *             properties:
 *               idUsuario: { type: integer, example: 1 }
 *               isbn: { type: string, example: '9788437604947' }
 *               diasPrestamo: { type: integer, minimum: 1, maximum: 30, example: 14 }
 *     responses:
 *       201:
 *         description: Préstamo registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario o libro no encontrado
 *       409:
 *         description: Regla de negocio violada (máximo 5 activos, préstamos vencidos o sin disponibilidad)
 */
router.post(
    '/',
    [
        body('idUsuario').isInt({ min: 1 }).withMessage('idUsuario debe ser entero positivo'),
        body('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
        body('diasPrestamo').isInt({ min: 1, max: 30 })
            .withMessage('diasPrestamo debe estar entre 1 y 30'),
    ],
    validate,
    controller.registrarPrestamo
);

/**
 * @swagger
 * /api/prestamos/{id}/devolucion:
 *   put:
 *     summary: Registrar la devolución de un préstamo
 *     tags: [Prestamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devolución registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestamo'
 *       404:
 *         description: Préstamo no encontrado
 *       409:
 *         description: El préstamo ya fue devuelto
 */
router.put(
    '/:id/devolucion',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.registrarDevolucion
);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   delete:
 *     summary: Eliminar un préstamo
 *     tags: [Prestamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Préstamo eliminado
 *       404:
 *         description: Préstamo no encontrado
 */
router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;