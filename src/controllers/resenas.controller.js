const resenasService = require('../services/resenas.service');

const listar = async (req, res, next) => {
    try {
        const resenas = await resenasService.listar();
        res.json(resenas);
    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {
    try {
        const resena = await resenasService.obtener(req.params.id);
        res.json(resena);
    } catch (err) {
        next(err);
    }
};

const crear = async (req, res, next) => {
    try {
        const resena = await resenasService.crear(req.body);
        res.status(201).json(resena);
    } catch (err) {
        next(err);
    }
};

const actualizar = async (req, res, next) => {
    try {
        const resena = await resenasService.actualizar(req.params.id, req.body);
        res.json(resena);
    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {
    try {
        await resenasService.eliminar(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const verificar = async (req, res, next) => {
    try {
        const { idUsuario, isbn } = req.params;
        const resultado = await resenasService.verificarResena(parseInt(idUsuario), isbn);
        res.json(resultado);
    } catch (err) {
        next(err);
    }
};

module.exports = { listar, obtener, crear, actualizar, eliminar, verificar };