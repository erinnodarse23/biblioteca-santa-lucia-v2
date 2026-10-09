const autoresRepo = require('../repositories/autores.repository');

class BusinessError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const listar = async () => autoresRepo.findAll();

const obtener = async (id) => {
    const autor = await autoresRepo.findById(id);
    if (!autor) throw new BusinessError('Autor no encontrado', 404);
    return autor;
};

const crear = async ({ nombre, apellido, fechaNacimiento, nacionalidad, biografia }) => {
    const existente = await autoresRepo.findByNombreApellido(nombre, apellido);
    if (existente) {
        throw new BusinessError(
            `Ya existe un autor con el nombre "${nombre} ${apellido}"`,
            409
        );
    }
    return autoresRepo.create({ nombre, apellido, fechaNacimiento, nacionalidad, biografia });
};

const actualizar = async (id, { nombre, apellido, fechaNacimiento, nacionalidad, biografia }) => {
    // Verificar que el autor existe
    const autorActual = await autoresRepo.findById(id);
    if (!autorActual) throw new BusinessError('Autor no encontrado', 404);

    // Verificar que el nuevo nombre+apellido no lo tenga otro autor
    const existente = await autoresRepo.findByNombreApellido(nombre, apellido);
    if (existente && existente.id_autor !== parseInt(id)) {
        throw new BusinessError(
            `Ya existe otro autor con el nombre "${nombre} ${apellido}"`,
            409
        );
    }

    return autoresRepo.update(id, { nombre, apellido, fechaNacimiento, nacionalidad, biografia });
};

const eliminar = async (id) => {
    try {
        const ok = await autoresRepo.remove(id);
        if (!ok) throw new BusinessError('Autor no encontrado', 404);
    } catch (err) {
        if (err.code === '23503') {
            throw new BusinessError(
                'No se puede eliminar el autor porque tiene libros asociados.',
                409
            );
        }
        throw err;
    }
};

module.exports = { listar, obtener, crear, actualizar, eliminar, BusinessError };