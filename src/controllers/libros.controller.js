const librosService = require('../services/libros.service');

const listar = async (req, res, next) => {
    try {
        const libros = await librosService.listar();
        res.json(libros);
    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {
    try {
        const libro = await librosService.obtener(req.params.isbn);
        res.json(libro);
    } catch (err) {
        next(err);
    }
};

const obtenerDetalleCompleto = async (req, res, next) => {
    try {
        const detalle = await librosService.obtenerDetalleCompleto(req.params.isbn);
        res.json(detalle);
    } catch (err) {
        next(err);
    }
};

const crear = async (req, res, next) => {
    try {
        const libro = await librosService.crear(req.body);
        res.status(201).json(libro);
    } catch (err) {
        next(err);
    }
};

const actualizar = async (req, res, next) => {
    try {
        const libro = await librosService.actualizar(req.params.isbn, req.body);
        res.json(libro);
    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {
    try {
        await librosService.eliminar(req.params.isbn);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { listar, obtener, obtenerDetalleCompleto, crear, actualizar, eliminar };