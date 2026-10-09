const autoresService = require('../services/autores.service');

const listar = async (req, res, next) => {
    try {
        const autores = await autoresService.listar();
        res.json(autores);
    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {
    try {
        const autor = await autoresService.obtener(req.params.id);
        res.json(autor);
    } catch (err) {
        next(err);
    }
};

const crear = async (req, res, next) => {
    try {
        const autor = await autoresService.crear(req.body);
        res.status(201).json(autor);
    } catch (err) {
        next(err);
    }
};

const actualizar = async (req, res, next) => {
    try {
        const autor = await autoresService.actualizar(req.params.id, req.body);
        res.json(autor);
    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {
    try {
        await autoresService.eliminar(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };