const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/resenas.controller');
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

router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;