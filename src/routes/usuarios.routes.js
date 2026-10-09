const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/usuarios.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', controller.listar);
router.get('/vencidos', controller.listarConVencidos);
router.get(
    '/:idUsuario/resena/:isbn',
    [
        param('idUsuario').isInt({ min: 1 }).withMessage('idUsuario debe ser entero positivo'),
        param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
    ],
    validate,
    controller.verificarResena
);

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
        body('email').notEmpty().withMessage('El email es obligatorio')
            .isEmail().withMessage('Email inválido')
            .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
        body('direccion').optional().isLength({ max: 200 }),
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
        body('email').notEmpty().isEmail().isLength({ max: 100 }),
        body('direccion').optional().isLength({ max: 200 }),
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