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
                url: "http://localhost:1200/api",
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
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Ruta a los archivos con anotaciones
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
