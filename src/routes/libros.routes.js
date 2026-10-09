const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/libros.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', controller.listar);
const { query } = require('express-validator');

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
// Detalle completo (debe ir ANTES de /:isbn para no confundirse)
router.get(
    '/:isbn/detalle',
    [param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos')],
    validate,
    controller.obtenerDetalleCompleto
);

router.get(
    '/:isbn',
    [param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos')],
    validate,
    controller.obtener
);

const validacionesLibro = [
    body('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
    body('titulo').notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
    body('fechaPublicacion').optional({ nullable: true }).isISO8601().withMessage('Fecha inválida (YYYY-MM-DD)'),
    body('numPaginas').optional({ nullable: true }).isInt({ min: 1 }).withMessage('numPaginas debe ser mayor a 0'),
    body('cantidadEjemplares').isInt({ min: 0 }).withMessage('cantidadEjemplares debe ser >= 0'),
    body('sintesis').optional().isString(),
    body('idAutor').isInt({ min: 1 }).withMessage('idAutor debe ser un entero positivo'),
    body('idGenero').isInt({ min: 1 }).withMessage('idGenero debe ser un entero positivo'),
];

router.post('/', validacionesLibro, validate, controller.crear);

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

router.delete(
    '/:isbn',
    [param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos')],
    validate,
    controller.eliminar
);
const prestamosController = require('../controllers/prestamos.controller');

router.get(
    '/:isbn/prestamos',
    [
        param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
        query('fechaIni').isISO8601().withMessage('fechaIni inválida (YYYY-MM-DD)'),
        query('fechaFin').isISO8601().withMessage('fechaFin inválida (YYYY-MM-DD)'),
    ],
    validate,
    (req, res, next) => {
        req.params.isbn = req.params.isbn;
        req.query.fechaIni = req.query.fechaIni;
        req.query.fechaFin = req.query.fechaFin;
        prestamosController.listarPorLibroYRango
            ? prestamosController.listarPorLibroYRango(req, res, next)
            : next();
    }
);
module.exports = router;