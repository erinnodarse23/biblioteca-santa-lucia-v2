const generosService = require('../services/generos.service');

const listar = async (req, res, next) => {
    try {
        const generos = await generosService.listar();
        res.json(generos);
    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {
    try {
        const genero = await generosService.obtener(req.params.id);
        res.json(genero);
    } catch (err) {
        next(err);
    }
};

const crear = async (req, res, next) => {
    try {
        const genero = await generosService.crear(req.body);
        res.status(201).json(genero);
    } catch (err) {
        next(err);
    }
};

const actualizar = async (req, res, next) => {
    try {
        const genero = await generosService.actualizar(req.params.id, req.body);
        res.json(genero);
    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {
    try {
        await generosService.eliminar(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };