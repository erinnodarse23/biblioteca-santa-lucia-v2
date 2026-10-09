const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/autores.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', controller.listar);

router.get(
    '/:id',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.obtener
);

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

router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;