const express = require('express');
const { body, param, query } = require('express-validator');
const controller = require('../controllers/prestamos.controller');
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
        body('diasPrestamo').isInt({ min: 1, max: 30 })
            .withMessage('diasPrestamo debe estar entre 1 y 30'),
    ],
    validate,
    controller.registrarPrestamo
);

router.put(
    '/:id/devolucion',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.registrarDevolucion
);

router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;