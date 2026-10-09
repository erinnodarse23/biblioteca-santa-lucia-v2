const generosRepo = require('../repositories/generos.repository');

class BusinessError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const listar = async () => generosRepo.findAll();

const obtener = async (id) => {
    const genero = await generosRepo.findById(id);
    if (!genero) throw new BusinessError('Género no encontrado', 404);
    return genero;
};

const crear = async ({ nombre, descripcion }) => {
    const existente = await generosRepo.findByNombre(nombre);
    if (existente) {
        throw new BusinessError(`Ya existe un género con el nombre "${nombre}"`, 409);
    }
    return generosRepo.create({ nombre, descripcion });
};

const actualizar = async (id, { nombre, descripcion }) => {
    // Verificar que el género existe
    const generoActual = await generosRepo.findById(id);
    if (!generoActual) throw new BusinessError('Género no encontrado', 404);

    // Verificar que el nuevo nombre no lo tenga otro género
    const existente = await generosRepo.findByNombre(nombre);
    if (existente && existente.id_genero !== parseInt(id)) {
        throw new BusinessError(`Ya existe otro género con el nombre "${nombre}"`, 409);
    }

    return generosRepo.update(id, { nombre, descripcion });
};

const eliminar = async (id) => {
    try {
        const ok = await generosRepo.remove(id);
        if (!ok) throw new BusinessError('Género no encontrado', 404);
    } catch (err) {
        if (err.code === '23503') {
            throw new BusinessError(
                'No se puede eliminar el género porque tiene libros asociados.',
                409
            );
        }
        throw err;
    }
};

module.exports = { listar, obtener, crear, actualizar, eliminar, BusinessError };