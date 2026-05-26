const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Comunidad DDG",
            version: "1.0.0",
            description: "Bienvenido a nuestra API\n\n" +
                "CREDENCIALES DE PRUEBA (ADMIN):\n" +
                "Usuario: gerardo\n" +
                "Contraseña: 00214917261998gerardo\n\n" +
                "Este usuario tiene acceso completo al sistema. Solo para entornos de prueba.",
        },
        servers: [
            {
                url: process.env.NODE_ENV == "development"
                    ? process.env.SWAGGER_URL_DEV
                    : process.env.SWAGGER_URL || "http://localhost:1200",
                description: process.env.NODE_ENV == "development"
                    ? "Servidor de Desarrollo"
                    : "Servidor de Producción"
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Introduce el token JWT en el formato: Bearer <token>"
                }
            },
            schemas: {
                Register: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "Juan Pérez"
                        },
                        username: {
                            type: "string",
                            example: "juanperez"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "juan@example.com"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            minLength: 6,
                            example: "password123"
                        },
                        telephone: {
                            type: "string",
                            example: "+50378787878"
                        },
                        age: {
                            type: "integer",
                            minimum: 18,
                            example: 25
                        },
                        role: {
                            type: "string",
                            enum: ["admin", "vigilant", "normal"],
                            default: "normal",
                            example: "vigilant"
                        }
                    },
                    required: ["name", "username", "email", "password", "telephone", "age", "role"]
                },
                Login: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            example: "juanperez"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "password123"
                        }
                    },
                    required: ["username", "password"]
                },
                Pay: {
                    type: "object",
                    properties: {
                        numberTarget: {
                            type: "string",
                            example: "4111111111111111"
                        },
                        context: {
                            type: "string",
                            example: "Pago de servicios de vigilancia"
                        },
                        amount: {
                            type: "number",
                            example: 150.50
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T14:30:00Z"
                        },
                        cvc: {
                            type: "integer",
                            example: 123
                        },
                        user: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011"
                        }
                    },
                    required: ["numberTarget", "context", "amount", "cvc", "user"]
                },
                Schedule: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "Horario Matutino"
                        },
                        lunes: {
                            type: "string",
                            example: "08:00-16:00"
                        },
                        martes: {
                            type: "string",
                            example: "08:00-16:00"
                        },
                        miercoles: {
                            type: "string",
                            example: "08:00-16:00"
                        },
                        jueves: {
                            type: "string",
                            example: "08:00-16:00"
                        },
                        viernes: {
                            type: "string",
                            example: "08:00-16:00"
                        },
                        sabado: {
                            type: "string",
                            example: "Libre"
                        },
                        domingo: {
                            type: "string",
                            example: "Libre"
                        }
                    }
                },
                Task: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            example: "Ronda de vigilancia"
                        },
                        description: {
                            type: "string",
                            example: "Realizar ronda por todas las áreas designadas"
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T14:30:00Z"
                        },
                        image: {
                            type: "string",
                            example: "ruta/a/la/imagen.jpg"
                        },
                        user: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011"
                        }
                    },
                    required: ["title", "description", "image", "user"]
                },
                Visit: {
                    type: "object",
                    properties: {
                        visitName: {
                            type: "string",
                            example: "Carlos López"
                        },
                        dui: {
                            type: "string",
                            example: "12345678-9"
                        },
                        numPlaca: {
                            type: "string",
                            example: "P123456"
                        },
                        visitHouse: {
                            type: "string",
                            example: "Casa #25"
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T14:30:00Z"
                        }
                    },
                    required: ["visitName", "dui", "numPlaca", "visitHouse"]
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011"
                        },
                        name: {
                            type: "string",
                            example: "Juan Pérez"
                        },
                        username: {
                            type: "string",
                            example: "juanperez"
                        },
                        email: {
                            type: "string",
                            example: "juan@example.com"
                        },
                        telephone: {
                            type: "string",
                            example: "+50378787878"
                        },
                        age: {
                            type: "integer",
                            example: 25
                        },
                        role: {
                            type: "string",
                            example: "vigilant"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-01-15T12:00:00Z"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-01-15T12:00:00Z"
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Error descriptivo para el usuario"
                        },
                        error: {
                            type: "string",
                            example: "Detalle técnico del error (solo en desarrollo)"
                        },
                        statusCode: {
                            type: "integer",
                            example: 400
                        }
                    }
                }
            },
            responses: {
                Unauthorized: {
                    description: "Token inválido o no proporcionado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            },
                            examples: {
                                invalidToken: {
                                    value: {
                                        message: "Token inválido o expirado",
                                        statusCode: 401
                                    }
                                },
                                missingToken: {
                                    value: {
                                        message: "Token de autenticación no proporcionado",
                                        statusCode: 401
                                    }
                                }
                            }
                        }
                    }
                },
                Forbidden: {
                    description: "No tiene permisos para acceder a este recurso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            },
                            example: {
                                message: "No tiene permisos de administrador",
                                statusCode: 403
                            }
                        }
                    }
                },
                ValidationError: {
                    description: "Error de validación en los datos de entrada",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            },
                            examples: {
                                missingField: {
                                    value: {
                                        message: "Validation error",
                                        error: "\"username\" is required",
                                        statusCode: 400
                                    }
                                },
                                invalidEmail: {
                                    value: {
                                        message: "Validation error",
                                        error: "\"email\" must be a valid email",
                                        statusCode: 400
                                    }
                                }
                            }
                        }
                    }
                },
                NotFound: {
                    description: "Recurso no encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            },
                            example: {
                                message: "Usuario no encontrado",
                                statusCode: 404
                            }
                        }
                    }
                },
                ServerError: {
                    description: "Error interno del servidor",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            },
                            example: {
                                message: "Error interno del servidor",
                                error: "Database connection failed",
                                statusCode: 500
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: "Autenticación",
                description: "Endpoints para registro, login y manejo de tokens"
            },
            {
                name: "Usuarios",
                description: "Gestión de usuarios del sistema"
            },
            {
                name: "Pagos",
                description: "Gestión de pagos a vigilantes"
            },
            {
                name: "Horarios",
                description: "Gestión de horarios de vigilancia"
            },
            {
                name: "Tareas",
                description: "Gestión de tareas asignadas"
            },
            {
                name: "Visitas",
                description: "Registro y control de visitas"
            }
        ],
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};

export default swaggerOptions;