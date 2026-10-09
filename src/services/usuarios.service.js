const usuariosRepo = require('../repositories/usuarios.repository');

class BusinessError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const listar = async () => usuariosRepo.findAll();

const obtener = async (id) => {
    const usuario = await usuariosRepo.findById(id);
    if (!usuario) throw new BusinessError('Usuario no encontrado', 404);
    return usuario;
};

const crear = async ({ nombre, apellido, email, direccion }) => {
    const existente = await usuariosRepo.findByEmail(email);
    if (existente) {
        throw new BusinessError(`Ya existe un usuario con el email "${email}"`, 409);
    }
    return usuariosRepo.create({ nombre, apellido, email, direccion });
};

const actualizar = async (id, { nombre, apellido, email, direccion }) => {
    const usuarioActual = await usuariosRepo.findById(id);
    if (!usuarioActual) throw new BusinessError('Usuario no encontrado', 404);

    const existente = await usuariosRepo.findByEmail(email);
    if (existente && existente.id_usuario !== parseInt(id)) {
        throw new BusinessError(`Ya existe otro usuario con el email "${email}"`, 409);
    }

    return usuariosRepo.update(id, { nombre, apellido, email, direccion });
};

const eliminar = async (id) => {
    try {
        const ok = await usuariosRepo.remove(id);
        if (!ok) throw new BusinessError('Usuario no encontrado', 404);
    } catch (err) {
        if (err.code === '23503') {
            throw new BusinessError(
                'No se puede eliminar el usuario porque tiene préstamos o reseñas asociados.',
                409
            );
        }
        throw err;
    }
};
const listarConVencidos = async () => {
    return usuariosRepo.findUsuariosConVencidos();
};
module.exports = { listar, obtener, crear, actualizar, eliminar, BusinessError, listarConVencidos };