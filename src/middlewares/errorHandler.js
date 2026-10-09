module.exports = (err, req, res, next) => {
    const status = err.status || 500;

    let errorType;
    if (status === 404) errorType = 'Recurso no encontrado';
    else if (status === 409) errorType = 'Conflicto';
    else if (status === 400) errorType = 'Solicitud inválida';
    else if (status === 500) errorType = 'Error interno del servidor';
    else errorType = 'Error';

    res.status(status).json({
        error: errorType,
        message: err.message,
        status,
        timestamp: new Date().toISOString(),
    });
};