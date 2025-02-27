TIENDA DE ROPA

Esta es una aplicación básica para montar una tienda de ropa. La idea es tener un catálogo de productos, un dashboard para gestionar (crear, editar, eliminar) productos y un sistema de autenticación con Firebase.

____________________________________________________________________________________________________________________________________________

Índice

- Descripción General
- Dependencias y Configuración
- Estructura del Proyecto
- Características de los Archivos
- Modelo de Producto
- Rutas y Controladores
- Documentación y Recursos
- Notas Finales

____________________________________________________________________________________________________________________________________________

Descripción General

La aplicación permite:

- Ver un catálogo de productos (con categorías, imágenes, descripciones y precios).
- Ver el detalle de cada producto.
- Un dashboard para el administrador donde se pueden crear, editar y eliminar productos.
- Registro e inicio de sesión usando Firebase Auth (la autenticación se hace en el cliente).
- Documentación de la API mediante Swagger.

____________________________________________________________________________________________________________________________________________

Estructura del Proyecto

.
├── config
│   ├── db.js
│   └── firebase.js
├── controllers
│   ├── authController.js
│   └── productController.js
├── middlewares
│   ├── verifyFirebaseToken.js
│   └── verifyAdmin.js
├── models
│   ├── Products.js
│   └── User.js
├── public
│   ├── js
│   │   ├── configLogin.js
│   │   └── configRegister.js
│   ├── utils
│   │   └── firebase.js
│   └── views
│       ├── dashboard.html
│       ├── login.html
│       ├── register.html
        └── styles.css
├── routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── viewRoutes.js
├── scripts
│   └── admin.js
├── docs
│   └── swagger.js
├── test
│   └── productController.test.js
├── .env
├── .gitignore
├── package.json
└── README.md                

____________________________________________________________________________________________________________________________________________

Dependencias y Configuración

Para que la aplicación funcione, se deben instalar las siguientes dependencias:

- express: para crear el servidor.
- mongoose: para conectarse a MongoDB (usamos Atlas para la base de datos).
- dotenv: para gestionar variables de entorno.
- express-session: para manejar sesiones.
- method-override: para permitir métodos PUT y DELETE en formularios HTML.
- firebase y firebase-admin: para la autenticación y administración de usuarios con Firebase.
- swagger-ui-express: para la documentación de la API.
- jest y supertest (en devDependencies): para realizar tests.
- mongodb-memory-server: para realizar test.

____________________________________________________________________________________________________________________________________________

Configuración

Crea un archivo .env en la raíz del proyecto con variables como:

- PORT
- MONGO_URI
- Datos y claves de Firebase

____________________________________________________________________________________________________________________________________________

Características de los Archivos

- config/db.js: Se encarga de conectar la aplicación con MongoDB usando Mongoose.
- config/firebase.js: Inicializa Firebase Admin con las credenciales del servicio.
- controllers/authController.js: Define funciones para servir las vistas de login y registro y para manejar las peticiones POST de login y registro (que en realidad son manejadas en el cliente con Firebase Auth).
- controllers/productController.js: Contiene funciones para mostrar, ver detalle, crear, editar y eliminar productos. Genera HTML dinámicamente usando template literals.
- models/Products.js: Define el esquema de producto con campos como nombre, descripción, imagen, categoría, talla y precio.
- models/User.js: Se usará para almacenar otros datos de usuarios si el proyecto crece.
- middlewares/verifyFirebaseToken.js: Valida el token de Firebase en cada solicitud y asigna el objeto decodificado a req.user.
- middlewares/verifyAdmin.js: Verifica que req.user tenga el claim de administrador. (Se utiliza en las rutas protegidas).
- public/js/configLogin.js y configRegister.js: Contienen la lógica para iniciar sesión y registrarse usando Firebase en el front-end.
- public/views/: Contiene archivos HTML para las vistas de login, registro y dashboard y CSS para los estilos.
- routes/authRoutes.js: Define las rutas para login, registro y logout.
- routes/productRoutes.js: Define las rutas para el catálogo de productos y las rutas de dashboard.
- routes/viewRoutes.js: Sirve vistas estáticas.
- scripts/setAdmin.js: Un script que asigna el custom claim { admin: true } a un usuario en Firebase, usando su UID.
- docs/swagger.js: Documenta la API con Swagger.
- test/productController.test.js: Tests para validar la funcionalidad de productos y autenticación.

____________________________________________________________________________________________________________________________________________

Modelo de Producto

El modelo de producto está definido en models/Products.js y tiene los siguientes campos:

- name: Nombre del producto (requerido).
- description: Descripción del producto (requerido).
- image: URL de la imagen del producto (requerido).
- category: Categoría del producto, que puede ser:
    - Camisetas
    - Pantalones
    - Zapatos
    - Accesorios
- size: Talla del producto:
    - Para Camisetas y Pantalones se permiten valores: "XS", "S", "M", "L", "XL".
    - Para Zapatos se permiten valores numéricos (por ejemplo, "36", "37", "38", "39", "40", "41", "42", "43").
    - Para Accesorios no es obligatorio.
- price: Precio del producto (requerido).

____________________________________________________________________________________________________________________________________________

Rutas y Controladores

Rutas de Productos:

- GET /products: Devuelve todos los productos en formato HTML, con tarjetas que incluyen imagen, nombre, descripción y precio.
- GET /products/:productId: Muestra el detalle de un producto. Si el usuario es administrador, se incluyen enlaces para editar y eliminar.
- GET /dashboard/new: Devuelve el formulario para agregar un nuevo producto (protegido para administradores).
- POST /dashboard: Crea un nuevo producto y redirige a /products (protegido para administradores).
- GET /dashboard/:productId/edit: Devuelve el formulario para editar un producto (protegido para administradores).
- PUT /dashboard/:productId: Actualiza un producto y redirige a la vista de detalle (protegido para administradores).
- DELETE /dashboard/:productId/delete: Elimina un producto y redirige a /products (protegido para administradores).

Rutas de Autenticación:

- GET /login: Devuelve la vista de login.
- GET /register: Devuelve la vista de registro.
- POST /login: y POST /register: Devuelven mensajes de error, ya que la autenticación se maneja en el cliente con Firebase Auth.
- GET /logout: Redirige a la vista de login.

Cada ruta tiene su controlador asociado en controllers/productController.js o controllers/authController.js

____________________________________________________________________________________________________________________________________________

Documentación y Recursos

Swagger: La documentación de la API está en el archivo docs/swagger.js y se puede acceder a ella en /api-docs.

Recursos Utilizados:
- Express
- Mongoose
- Firebase Authentication
- Firebase Admin SDK
- Swagger UI Express
- Jest
- Supertest