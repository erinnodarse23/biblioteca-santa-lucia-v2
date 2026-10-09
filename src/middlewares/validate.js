const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Error de validación',
            message: 'Los datos enviados no son válidos',
            invalidFields: errors.array().map(e => ({ field: e.path, reason: e.msg })),
        });
    }
    next();
};