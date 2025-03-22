import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

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
app.use("/api/professor", professorRoutes);
app.use("/api/courses", courseRoutes);

//Manejo de errores generales
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Error interno en el servidor.');
});


export default app;