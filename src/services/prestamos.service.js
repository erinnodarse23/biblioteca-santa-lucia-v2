const prestamosRepo = require('../repositories/prestamos.repository');
const usuariosRepo = require('../repositories/usuarios.repository');
const librosRepo = require('../repositories/libros.repository');

class BusinessError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const listar = async () => prestamosRepo.findAll();

const obtener = async (id) => {
    const prestamo = await prestamosRepo.findById(id);
    if (!prestamo) throw new BusinessError('Préstamo no encontrado', 404);
    return prestamo;
};

const registrarPrestamo = async ({ idUsuario, isbn, diasPrestamo }) => {
    // 1. Validar que el usuario exista
    const usuario = await usuariosRepo.findById(idUsuario);
    if (!usuario) throw new BusinessError(`El usuario con id ${idUsuario} no existe`, 404);

    // 2. Validar que el libro exista
    const libro = await librosRepo.findByIsbn(isbn);
    if (!libro) throw new BusinessError(`El libro con ISBN ${isbn} no existe`, 404);

    // 3. Validar máximo 5 préstamos activos
    const activos = await prestamosRepo.countActivosByUsuario(idUsuario);
    if (activos >= 5) {
        throw new BusinessError(
            `El usuario ya tiene ${activos} préstamos activos. Máximo permitido: 5.`,
            409
        );
    }

    // 4. Validar préstamos vencidos
    const vencidos = await prestamosRepo.countVencidosByUsuario(idUsuario);
    if (vencidos > 0) {
        throw new BusinessError(
            `El usuario tiene ${vencidos} préstamo(s) vencido(s). Debe regularizar antes de solicitar nuevos.`,
            409
        );
    }

    // 5. Validar disponibilidad de ejemplares
    const prestadosActivos = await prestamosRepo.countActivosByLibro(isbn);
    const disponibles = libro.cantidad_ejemplares - prestadosActivos;
    if (disponibles <= 0) {
        throw new BusinessError('No hay ejemplares disponibles de este libro', 409);
    }

    // 6. Registrar el préstamo
    return prestamosRepo.create({ idUsuario, isbn, diasPrestamo });
};

const registrarDevolucion = async (id) => {
    const prestamo = await prestamosRepo.findById(id);
    if (!prestamo) throw new BusinessError('Préstamo no encontrado', 404);

    if (prestamo.fecha_devolucion_real) {
        throw new BusinessError('Este préstamo ya fue devuelto', 409);
    }

    return prestamosRepo.registrarDevolucion(id);
};

const eliminar = async (id) => {
    const ok = await prestamosRepo.remove(id);
    if (!ok) throw new BusinessError('Préstamo no encontrado', 404);
};

const listarPorLibroYRango = async (isbn, fechaIni, fechaFin) => {
    // Validar que el libro exista
    const libro = await librosRepo.findByIsbn(isbn);
    if (!libro) throw new BusinessError(`El libro con ISBN ${isbn} no existe`, 404);

    // Validar que el rango de fechas sea coherente
    if (fechaIni > fechaFin) {
        throw new BusinessError('La fecha inicial no puede ser posterior a la fecha final', 400);
    }

    return prestamosRepo.findByLibroAndRango(isbn, fechaIni, fechaFin);
};

module.exports = {
    listar,
    obtener,
    registrarPrestamo,
    registrarDevolucion,
    eliminar,
    listarPorLibroYRango,
    BusinessError,
};