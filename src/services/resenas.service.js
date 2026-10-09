const resenasRepo = require('../repositories/resenas.repository');
const usuariosRepo = require('../repositories/usuarios.repository');
const librosRepo = require('../repositories/libros.repository');

class BusinessError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const listar = async () => resenasRepo.findAll();

const obtener = async (id) => {
    const resena = await resenasRepo.findById(id);
    if (!resena) throw new BusinessError('Reseña no encontrada', 404);
    return resena;
};

const crear = async ({ idUsuario, isbn, calificacion, comentario }) => {
    // 1. Validar que el usuario exista
    const usuario = await usuariosRepo.findById(idUsuario);
    if (!usuario) throw new BusinessError(`El usuario con id ${idUsuario} no existe`, 404);

    // 2. Validar que el libro exista
    const libro = await librosRepo.findByIsbn(isbn);
    if (!libro) throw new BusinessError(`El libro con ISBN ${isbn} no existe`, 404);

    // 3. Validar que el usuario ya haya devuelto ese libro
    const tieneDevuelto = await resenasRepo.tienePrestamoDevuelto(idUsuario, isbn);
    if (!tieneDevuelto) {
        throw new BusinessError(
            'Solo se puede reseñar un libro después de haberlo devuelto',
            409
        );
    }

    // 4. Validar que no exista otra reseña del mismo usuario para el mismo libro
    const existente = await resenasRepo.findByUsuarioAndLibro(idUsuario, isbn);
    if (existente) {
        throw new BusinessError(
            'Ya has publicado una reseña para este libro. Solo se permite una por usuario.',
            409
        );
    }

    return resenasRepo.create({ idUsuario, isbn, calificacion, comentario });
};

const actualizar = async (id, { calificacion, comentario }) => {
    const resenaActual = await resenasRepo.findById(id);
    if (!resenaActual) throw new BusinessError('Reseña no encontrada', 404);

    return resenasRepo.update(id, { calificacion, comentario });
};

const eliminar = async (id) => {
    const ok = await resenasRepo.remove(id);
    if (!ok) throw new BusinessError('Reseña no encontrada', 404);
};

const verificarResena = async (idUsuario, isbn) => {
    // Validar que el usuario y el libro existan (opcional, pero útil)
    const usuario = await usuariosRepo.findById(idUsuario);
    if (!usuario) throw new BusinessError(`El usuario con id ${idUsuario} no existe`, 404);

    const libro = await librosRepo.findByIsbn(isbn);
    if (!libro) throw new BusinessError(`El libro con ISBN ${isbn} no existe`, 404);

    const existe = await resenasRepo.findByUsuarioAndLibro(idUsuario, isbn);
    return { yaResenado: !!existe };
};

module.exports = { listar, obtener, crear, actualizar, eliminar, verificarResena, BusinessError };