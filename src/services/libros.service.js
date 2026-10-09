const librosRepo = require('../repositories/libros.repository');
const autoresRepo = require('../repositories/autores.repository');
const generosRepo = require('../repositories/generos.repository');

class BusinessError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const listar = async () => librosRepo.findAll();

const obtener = async (isbn) => {
    const libro = await librosRepo.findByIsbn(isbn);
    if (!libro) throw new BusinessError('Libro no encontrado', 404);
    return libro;
};

const obtenerDetalleCompleto = async (isbn) => {
    const detalle = await librosRepo.findDetalleCompleto(isbn);
    if (!detalle) throw new BusinessError('Libro no encontrado', 404);
    return detalle;
};

const validarRelaciones = async (idAutor, idGenero) => {
    const autor = await autoresRepo.findById(idAutor);
    if (!autor) throw new BusinessError(`El autor con id ${idAutor} no existe`, 404);

    const genero = await generosRepo.findById(idGenero);
    if (!genero) throw new BusinessError(`El género con id ${idGenero} no existe`, 404);
};

const crear = async (data) => {
    // Verificar que el ISBN no exista
    const existente = await librosRepo.findByIsbn(data.isbn);
    if (existente) {
        throw new BusinessError(`Ya existe un libro con el ISBN "${data.isbn}"`, 409);
    }

    // Validar que autor y género existan
    await validarRelaciones(data.idAutor, data.idGenero);

    return librosRepo.create(data);
};

const actualizar = async (isbn, data) => {
    const libroActual = await librosRepo.findByIsbn(isbn);
    if (!libroActual) throw new BusinessError('Libro no encontrado', 404);

    await validarRelaciones(data.idAutor, data.idGenero);

    return librosRepo.update(isbn, data);
};

const eliminar = async (isbn) => {
    const ok = await librosRepo.remove(isbn);
    if (!ok) throw new BusinessError('Libro no encontrado', 404);
};

module.exports = { listar, obtener, obtenerDetalleCompleto, crear, actualizar, eliminar, BusinessError };