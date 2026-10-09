Biblioteca Santa Lucía - API REST (Node.js + Express)
API REST para la gestión integral de una biblioteca: catálogo de libros, autores, géneros, usuarios, préstamos, devoluciones y reseñas. Implementada con Node.js, Express y PostgreSQL, siguiendo una arquitectura en capas con repositorios, servicios y controladores.

Versión 2.0 del proyecto original desarrollado en Java + Spring Boot. Esta versión migra el backend a Node.js y servirá como base para un futuro frontend.

🛠️ Tecnologías utilizadas
Tecnología	Propósito
Node.js	Entorno de ejecución de JavaScript.
Express	Framework web para construir la API REST.
PostgreSQL	Sistema de gestión de bases de datos relacional.
pg	Cliente oficial de PostgreSQL para Node.js.
express-validator	Validación declarativa de datos de entrada.
dotenv	Gestión de variables de entorno.
cors	Habilitación de CORS para el futuro frontend.
swagger-jsdoc + swagger-ui-express	Documentación interactiva de la API.
nodemon	Recarga automática en desarrollo.
Maven	(solo en la versión original Java).
✨ Funcionalidades
CRUD completo
Autores

Géneros

Libros

Usuarios

Préstamos

Reseñas

Funcionalidades especiales
Detalle completo de un libro: incluye autor, género, calificación promedio, total de reseñas y copias disponibles.

Préstamos de un libro por rango de fechas.

Registro de préstamo con validaciones:

Máximo 5 préstamos activos por usuario.

Bloqueo si el usuario tiene préstamos vencidos.

Verificación de disponibilidad de ejemplares.

Registro de devolución.

Listado de usuarios con préstamos vencidos (con cantidad de vencidos por usuario).

Verificación de reseña única por usuario-libro.

Reseña solo después de devolver el libro.

Reglas de negocio implementadas
Máximo 5 libros prestados simultáneamente por usuario.

Bloqueo de nuevos préstamos si hay devoluciones vencidas.

No se puede prestar un libro sin ejemplares disponibles.

Un usuario solo puede reseñar un libro una vez.

Solo se puede reseñar tras haber devuelto el ejemplar.

La calificación debe estar entre 1 y 5.

📋 Requisitos previos
Antes de ejecutar el proyecto, asegúrate de tener instalado:

Node.js v18 o superior (descargar)

PostgreSQL v10 o superior (descargar)

Git (descargar)

Un editor de código (recomendado: Visual Studio Code)

🚀 Instalación y configuración
1. Clonar el repositorio
bash
git clone https://github.com/erinnodarse23/biblioteca-santa-lucia-v2.git
cd biblioteca-santa-lucia-v2
2. Instalar dependencias
bash
npm install
3. Crear la base de datos en PostgreSQL
sql
CREATE DATABASE biblioteca_santa_lucia;
4. Ejecutar el script de tablas
bash
psql -U postgres -d biblioteca_santa_lucia -f sql/schema.sql
O abre pgAdmin, conéctate a la base y ejecuta el contenido de sql/schema.sql en el Query Tool.

5. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=biblioteca_santa_lucia
⚠️ El archivo .env no se sube a GitHub (está en .gitignore).

6. Ejecutar el servidor
Modo desarrollo (con recarga automática):

bash
npm run dev
Modo producción:

bash
npm start
Deberías ver en consola:

text
🚀 Servidor corriendo en http://localhost:3000
✅ Conectado a PostgreSQL
✅ PostgreSQL conectado: 2026-10-08T...
📚 Documentación interactiva (Swagger UI)
Una vez que el servidor esté corriendo, abre en tu navegador:

text
http://localhost:3000/api-docs
Ahí podrás ver todos los endpoints documentados, sus parámetros, esquemas de datos y probarlos directamente desde la interfaz.

🔗 Endpoints principales
Autores
Método	Endpoint	Descripción
GET	/api/autores	Listar todos los autores
GET	/api/autores/:id	Obtener un autor por ID
POST	/api/autores	Crear autor
PUT	/api/autores/:id	Actualizar autor
DELETE	/api/autores/:id	Eliminar autor
Géneros
Método	Endpoint	Descripción
GET	/api/generos	Listar todos los géneros
GET	/api/generos/:id	Obtener género por ID
POST	/api/generos	Crear género
PUT	/api/generos/:id	Actualizar género
DELETE	/api/generos/:id	Eliminar género
Libros
Método	Endpoint	Descripción
GET	/api/libros	Listar todos los libros
GET	/api/libros/:isbn	Obtener libro por ISBN
GET	/api/libros/:isbn/detalle	Detalle completo del libro
GET	/api/libros/:isbn/prestamos?fechaIni=&fechaFin=	Préstamos por rango de fechas
POST	/api/libros	Crear libro
PUT	/api/libros/:isbn	Actualizar libro
DELETE	/api/libros/:isbn	Eliminar libro
Usuarios
Método	Endpoint	Descripción
GET	/api/usuarios	Listar todos los usuarios
GET	/api/usuarios/:id	Obtener usuario por ID
GET	/api/usuarios/vencidos	Usuarios con préstamos vencidos
GET	/api/usuarios/:idUsuario/resena/:isbn	Verificar si ya reseñó un libro
POST	/api/usuarios	Crear usuario
PUT	/api/usuarios/:id	Actualizar usuario
DELETE	/api/usuarios/:id	Eliminar usuario
Préstamos
Método	Endpoint	Descripción
GET	/api/prestamos	Listar todos los préstamos
GET	/api/prestamos/:id	Obtener préstamo por ID
POST	/api/prestamos	Registrar préstamo
PUT	/api/prestamos/:id/devolucion	Registrar devolución
DELETE	/api/prestamos/:id	Eliminar préstamo
Reseñas
Método	Endpoint	Descripción
GET	/api/resenas	Listar todas las reseñas
GET	/api/resenas/:id	Obtener reseña por ID
POST	/api/resenas	Crear reseña
PUT	/api/resenas/:id	Actualizar reseña
DELETE	/api/resenas/:id	Eliminar reseña
📁 Estructura del proyecto
text
biblioteca-santa-lucia-v2/
├── src/
│   ├── config/
│   │   ├── db.js                 # Conexión a PostgreSQL
│   │   └── swagger.js            # Configuración de Swagger UI
│   ├── repositories/             # Acceso a datos (SQL puro)
│   │   ├── autores.repository.js
│   │   ├── generos.repository.js
│   │   ├── libros.repository.js
│   │   ├── usuarios.repository.js
│   │   ├── prestamos.repository.js
│   │   └── resenas.repository.js
│   ├── services/                 # Lógica de negocio
│   │   ├── autores.service.js
│   │   ├── generos.service.js
│   │   ├── libros.service.js
│   │   ├── usuarios.service.js
│   │   ├── prestamos.service.js
│   │   └── resenas.service.js
│   ├── controllers/              # Reciben peticiones HTTP
│   │   ├── autores.controller.js
│   │   ├── generos.controller.js
│   │   ├── libros.controller.js
│   │   ├── usuarios.controller.js
│   │   ├── prestamos.controller.js
│   │   └── resenas.controller.js
│   ├── routes/                   # Definición de endpoints
│   │   ├── autores.routes.js
│   │   ├── generos.routes.js
│   │   ├── libros.routes.js
│   │   ├── usuarios.routes.js
│   │   ├── prestamos.routes.js
│   │   └── resenas.routes.js
│   ├── middlewares/              # Manejo global de errores y validaciones
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── app.js                    # Configuración de Express
│   └── server.js                 # Punto de entrada
├── sql/
│   └── schema.sql                # Script de creación de tablas
├── .env                          # Variables de entorno (no se sube)
├── .gitignore
├── package.json
└── README.md
Arquitectura en capas
text
Cliente (Postman / Frontend)
    │
    ▼
Controlador  ──►  Servicio  ──►  Repositorio  ──►  PostgreSQL
(HTTP)         (negocio)       (SQL puro)
Controlador: recibe la petición, valida y responde.

Servicio: aplica reglas de negocio, lanza excepciones.

Repositorio: ejecuta el SQL y devuelve datos puros.

🧪 Pruebas
Puedes probar los endpoints de tres formas:

1. Swagger UI
Abre http://localhost:3000/api-docs y usa el botón "Try it out".

2. Postman
Importa las rutas manualmente o crea una colección.

3. REST Client (VS Code)
Crea un archivo api-test.http y usa la extensión REST Client:

http
### Listar autores
GET http://localhost:3000/api/autores

### Crear autor
POST http://localhost:3000/api/autores
Content-Type: application/json

{
    "nombre": "Gabriel",
    "apellido": "García Márquez",
    "fechaNacimiento": "1927-03-06",
    "nacionalidad": "Colombiana",
    "biografia": "Premio Nobel de Literatura 1982"
}
🤝 Contribuciones
Este proyecto es de carácter académico, pero cualquier sugerencia es bienvenida. Para cambios importantes, abre primero un issue describiendo qué te gustaría cambiar.

📄 Licencia
ISC

👤 Autor
Erin Odarse

GitHub: @erinnodarse23

🔗 Repositorios relacionados
Versión original (Java + Spring Boot): backend-biblioteca-santa-lucia

Versión Node.js + Express (este repo): biblioteca-santa-lucia-v2

📌 Roadmap
☑ Backend Node.js + Express
☑ CRUD de todas las entidades
☑ Funcionalidades especiales
☑ Validaciones y manejo de errores
☑ Documentación con Swagger UI
□ Autenticación con JWT
□ Frontend (React / Vue / Angular)
□ Tests automatizados (Jest + Supertest)
□ Despliegue en producción
Última actualización: Octubre 2026