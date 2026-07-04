import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Proyecto IS 2025",
            version: "1.0.0",
            description: "Esta es la documentación oficial de nuestra API para el Proyecto de Ingeniería de Software 2025. Aquí encontrarás todo lo necesario para interactuar con el sistema.",
            contact: {
                name: "Equipo de Soporte",
            },
        },
        servers: [
            {
                url: "http://localhost:1200",
                description: "Servidor de Desarrollo (Local)",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

            schemas: {

                Register: {
                    type: "object",
                    required: [
                        "name",
                        "username",
                        "email",
                        "password",
                        "telephone",
                        "age"
                    ],
                    properties: {
                        name: {
                            type: "string"
                        },
                        username: {
                            type: "string"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        password: {
                            type: "string",
                            minLength: 12
                        },
                        telephone: {
                            type: "string",
                            minLength: 8,
                            pattern: "^\\d+$"
                        },
                        age: {
                            type: "integer",
                            minimum: 18
                        },
                        role: {
                            type: "string",
                            enum: ["normal", "vigilant", "admin"]
                        }
                    }
                },

                Login: {
                    type: "object",
                    required: [
                        "username",
                        "password"
                    ],
                    properties: {
                        username: {
                            type: "string"
                        },
                        password: {
                            type: "string"
                        }
                    }
                },

                CreateTask: {
                    type: "object",
                    required: [
                        "title",
                        "description",
                        "image"
                    ],
                    properties: {
                        title: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        image: {
                            type: "string"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        },
                        location: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    enum: ["Point"]
                                },
                                coordinates: {
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                }
                            }
                        }
                    }
                },

                CreateTaskD: {
                    type: "object",
                    required: [
                        "title2",
                        "description2"
                    ],
                    properties: {
                        title2: {
                            type: "string"
                        },
                        description2: {
                            type: "string"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },

                CreateSchedule: {
                    type: "object",
                    required: [
                        "day",
                        "startTime",
                        "endTime"
                    ],
                    properties: {
                        day: {
                            type: "string"
                        },
                        startTime: {
                            type: "string"
                        },
                        endTime: {
                            type: "string"
                        }
                    }
                },

                CreateVisit: {
                    type: "object",
                    required: [
                        "visitorName",
                        "reason"
                    ],
                    properties: {
                        visitorName: {
                            type: "string"
                        },
                        reason: {
                            type: "string"
                        }
                    }
                },

                CreatePay: {
                    type: "object",
                    required: [
                        "numberTarget",
                        "context",
                        "amount",
                        "cvc",
                        "date"
                    ],
                    properties: {
                        numberTarget: {
                            type: "string",
                            minLength: 16
                        },
                        context: {
                            type: "string"
                        },
                        amount: {
                            type: "number",
                            minimum: 0
                        },
                        cvc: {
                            type: "number"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }

            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec: any = swaggerJSDoc(swaggerOptions);

// Corrige automáticamente las rutas documentadas como /api/v1/* a /api/*
const newPaths: Record<string, any> = {};

Object.entries(swaggerSpec.paths).forEach(([key, value]) => {
    if (key.startsWith("/api/v1")) {
        newPaths[key.replace("/api/v1", "/api")] = value;
    } else {
        newPaths[key] = value;
    }
});

swaggerSpec.paths = newPaths;

export { swaggerSpec };