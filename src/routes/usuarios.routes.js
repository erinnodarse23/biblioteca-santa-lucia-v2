const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/usuarios.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /api/usuarios/vencidos:
 *   get:
 *     summary: Listar usuarios con préstamos vencidos
 *     description: Devuelve la cantidad de préstamos vencidos por usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios con vencidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario: { type: integer, example: 1 }
 *                   nombre: { type: string, example: 'Ana' }
 *                   apellido: { type: string, example: 'Pérez' }
 *                   email: { type: string, example: 'ana@example.com' }
 *                   prestamos_vencidos: { type: integer, example: 2 }
 */
router.get('/vencidos', controller.listarConVencidos);

/**
 * @swagger
 * /api/usuarios/{idUsuario}/resena/{isbn}:
 *   get:
 *     summary: Verificar si un usuario ya reseñó un libro
 *     description: Evita reseñas duplicadas
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado de la verificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 yaResenado: { type: boolean, example: true }
 *       404:
 *         description: Usuario o libro no encontrado
 */
router.get(
    '/:idUsuario/resena/:isbn',
    [
        param('idUsuario').isInt({ min: 1 }).withMessage('idUsuario debe ser entero positivo'),
        param('isbn').matches(/^[0-9]{13}$/).withMessage('ISBN debe tener 13 dígitos'),
    ],
    validate,
    controller.verificarResena
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
    '/:id',
    [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')],
    validate,
    controller.obtener
);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, email]
 *             properties:
 *               nombre: { type: string, example: 'Ana' }
 *               apellido: { type: string, example: 'Pérez' }
 *               email: { type: string, format: email, example: 'ana@example.com' }
 *               direccion: { type: string, example: 'Calle 23 #456, La Habana' }
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe un usuario con ese email
 */
router.post(
    '/',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio')
            .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
        body('apellido').notEmpty().withMessage('El apellido es obligatorio')
            .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
        body('email').notEmpty().withMessage('El email es obligatorio')
            .isEmail().withMessage('Email inválido')
            .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
        body('direccion').optional().isLength({ max: 200 }),
    ],
    validate,
    controller.crear
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, email]
 *             properties:
 *               nombre: { type: string }
 *               apellido: { type: string }
 *               email: { type: string, format: email }
 *               direccion: { type: string }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Ya existe otro usuario con ese email
 */
router.put(
    '/:id',
    [
        param('id').isInt({ min: 1 }),
        body('nombre').notEmpty().isLength({ max: 50 }),
        body('apellido').notEmpty().isLength({ max: 50 }),
        body('email').notEmpty().isEmail().isLength({ max: 100 }),
        body('direccion').optional().isLength({ max: 200 }),
    ],
    validate,
    controller.actualizar
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: No se puede eliminar porque tiene préstamos o reseñas asociados
 */
router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    validate,
    controller.eliminar
);

module.exports = router;