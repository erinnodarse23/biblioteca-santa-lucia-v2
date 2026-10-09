const usuariosService = require('../services/usuarios.service');

const listar = async (req, res, next) => {
    try {
        const usuarios = await usuariosService.listar();
        res.json(usuarios);
    } catch (err) {
        next(err);
    }
};

const obtener = async (req, res, next) => {
    try {
        const usuario = await usuariosService.obtener(req.params.id);
        res.json(usuario);
    } catch (err) {
        next(err);
    }
};

const crear = async (req, res, next) => {
    try {
        const usuario = await usuariosService.crear(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
};

const actualizar = async (req, res, next) => {
    try {
        const usuario = await usuariosService.actualizar(req.params.id, req.body);
        res.json(usuario);
    } catch (err) {
        next(err);
    }
};

const eliminar = async (req, res, next) => {
    try {
        await usuariosService.eliminar(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
const resenasService = require('../services/resenas.service');

const verificarResena = async (req, res, next) => {
    try {
        const { idUsuario, isbn } = req.params;
        const resultado = await resenasService.verificarResena(parseInt(idUsuario), isbn);
        res.json(resultado);
    } catch (err) {
        next(err);
    }
};
const listarConVencidos = async (req, res, next) => {
    try {
        const usuarios = await usuariosService.listarConVencidos();
        res.json(usuarios);
    } catch (err) {
        next(err);
    }
};
module.exports = { listar, obtener, crear, actualizar, eliminar, verificarResena, listarConVencidos };
