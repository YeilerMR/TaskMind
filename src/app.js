import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
// import specs from '../swagger/swagger.js';
// import swaggerDoc from '../swagger/swagger-doc.json'

import fs from 'fs';
import YAML from 'yaml';
const file = fs.readFileSync('./swagger/professor.yml', 'utf8');
const swaggerDocument = YAML.parse(file);

import Console from "./Lib/Console.js";

const logger = new Console("APP");

import professorRoutes from "./routes/professor.routes.js";
import courseRoutes from "./routes/course.routes.js";

const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json({ limit: "70mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Rutas
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));//ruta para el swagger
app.use("/api/professor", professorRoutes);
app.use("/api/courses", courseRoutes);

//Manejo de errores generales
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Error interno en el servidor.');
});


export default app;