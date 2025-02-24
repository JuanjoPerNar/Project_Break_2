module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Tienda de Ropa API",
    version: "1.0.0",
    description: "Documentación de la API para la Tienda de Ropa"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desarrollo"
    }
  ],
  paths: {
    "/products": {
      get: {
        summary: "Obtiene todos los productos",
        description: "Devuelve una lista de productos en formato HTML.",
        responses: {
          "200": {
            description: "Lista de productos"
          }
        }
      }
    },
    "/products/{productId}": {
      get: {
        summary: "Obtiene el detalle de un producto",
        description: "Devuelve el detalle de un producto en formato HTML.",
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: {
              type: "string"
            },
            description: "ID del producto"
          }
        ],
        responses: {
          "200": {
            description: "Detalle del producto"
          },
          "404": {
            description: "Producto no encontrado"
          }
        }
      }
    },
    "/dashboard": {
      get: {
        summary: "Muestra el dashboard",
        description: "Ruta protegida que muestra el dashboard en HTML.",
        responses: {
          "200": {
            description: "Vista del dashboard"
          },
          "401": {
            description: "Token inválido o no proporcionado"
          }
        }
      },
      post: {
        summary: "Crea un nuevo producto",
        description: "Recibe los datos de un nuevo producto y lo almacena en la base de datos, luego redirige a /products.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string" },
                  category: { type: "string" },
                  size: { type: "string" },
                  price: { type: "number" }
                },
                required: ["name", "description", "image", "category", "price"]
              }
            }
          }
        },
        responses: {
          "302": {
            description: "Redirige a /products tras crear el producto"
          },
          "400": {
            description: "Error: faltan campos obligatorios"
          },
          "401": {
            description: "Token inválido o no proporcionado"
          }
        }
      }
    },
    "/dashboard/new": {
      get: {
        summary: "Muestra el formulario para crear un nuevo producto",
        responses: {
          "200": {
            description: "Formulario en HTML para crear un nuevo producto"
          },
          "401": {
            description: "Token inválido o no proporcionado"
          }
        }
      }
    },
    "/dashboard/{productId}/edit": {
      get: {
        summary: "Muestra el formulario para editar un producto",
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: {
              type: "string"
            },
            description: "ID del producto a editar"
          }
        ],
        responses: {
          "200": {
            description: "Formulario en HTML para editar el producto"
          },
          "401": {
            description: "Token inválido o no proporcionado"
          },
          "404": {
            description: "Producto no encontrado"
          }
        }
      }
    },
    "/dashboard/{productId}": {
      put: {
        summary: "Actualiza un producto existente",
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: {
              type: "string"
            },
            description: "ID del producto a actualizar"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string" },
                  category: { type: "string" },
                  size: { type: "string" },
                  price: { type: "number" }
                },
                required: ["name", "description", "image", "category", "price"]
              }
            }
          }
        },
        responses: {
          "302": {
            description: "Redirige al detalle del producto tras actualizarlo"
          },
          "401": {
            description: "Token inválido o no proporcionado"
          }
        }
      }
    },
    "/dashboard/{productId}/delete": {
      delete: {
        summary: "Elimina un producto",
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: {
              type: "string"
            },
            description: "ID del producto a eliminar"
          }
        ],
        responses: {
          "302": {
            description: "Redirige a /products tras eliminar el producto"
          },
          "401": {
            description: "Token inválido o no proporcionado"
          }
        }
      }
    },
    "/login": {
      get: {
        summary: "Muestra la vista de login",
        responses: {
          "200": {
            description: "Vista de login en HTML"
          }
        }
      },
      post: {
        summary: "Procesa el login",
        responses: {
          "400": {
            description: "El login debe realizarse a través del cliente con Firebase Auth"
          }
        }
      }
    },
    "/register": {
      get: {
        summary: "Muestra la vista de registro",
        responses: {
          "200": {
            description: "Vista de registro en HTML"
          }
        }
      },
      post: {
        summary: "Procesa el registro",
        responses: {
          "400": {
            description: "El registro debe realizarse a través del cliente con Firebase Auth"
          }
        }
      }
    },
    "/logout": {
      get: {
        summary: "Cierra la sesión",
        responses: {
          "200": {
            description: "Mensaje indicando que el logout se debe manejar en el cliente"
          }
        }
      }
    }
  }
}
