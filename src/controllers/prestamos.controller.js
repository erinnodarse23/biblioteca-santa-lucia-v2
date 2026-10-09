const prestamosService = require('../services/prestamos.service');

const listar = async (req, res, next) => {
    try {
        const prestamos = await prestamosService.listar();
        res.json(prestamos);
    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {
    try {
        const prestamo = await prestamosService.obtener(req.params.id);
        res.json(prestamo);
    } catch (err) {
        next(err);
    }
};

const registrarPrestamo = async (req, res, next) => {
    try {
        const prestamo = await prestamosService.registrarPrestamo(req.body);
        res.status(201).json(prestamo);
    } catch (err) {
        next(err);
    }
};

const registrarDevolucion = async (req, res, next) => {
    try {
        const prestamo = await prestamosService.registrarDevolucion(req.params.id);
        res.json(prestamo);
    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {
    try {
        await prestamosService.eliminar(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { listar, obtener, registrarPrestamo, registrarDevolucion, eliminar };