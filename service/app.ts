import express from "express"; // Importa Express para crear el servidor
import 'dotenv/config'; // Carga las variables de entorno desde .env
import mainRouter from "./src/routes/route.main.js"; // Rutas principales (auth u otras)
import { connectiondb } from "./src/config/dbConnection.js"; // Función para conectar a la base de datos
import cookieParser from "cookie-parser"; // Middleware para leer cookies
import taskRoute from "./src/routes/route.task.js"; // Rutas relacionadas con tareas
import cors from "cors"; // Middleware para habilitar CORS
import vigilantRoute from "./src/routes/route.vigilant.js"; // Rutas relacionadas con vigilantes/visitas
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./src/swagger/swagger.options.js";
import { swaggerSpec } from "./src/config/swagger.js";
import { errorHandler } from "./src/middlewares/error.handler.js";

const app = express(); // Crea la aplicación Express

connectiondb(); // Establece conexión con la base de datos al iniciar el servidor

// Configura CORS para permitir solicitudes desde el frontend y con envío de cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Permite recibir JSON con un límite de 50MB
app.use(express.json({ limit: "50mb" }));

// Permite recibir datos codificados en formularios
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser()); // Habilita lectura y manejo de cookies

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Usa las distintas rutas del proyecto, todas bajo el prefijo /api
app.use("/api", mainRouter);
app.use("/api", taskRoute);
app.use("/api", vigilantRoute);

// Define el puerto del servidor
const PORT = process.env.PORT || 1200;

// Middleware global de manejo de errores (debe ir AL FINAL)
app.use(errorHandler);

// Inicia el servidor escuchando el puerto asignado
app.listen(PORT, () => {
    console.log("El servidor está trabajando en el puerto: " + PORT);
    console.log("Documentación Swagger disponible en: http://localhost:" + PORT + "/api-docs");
});
