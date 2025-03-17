import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import Console from "./Lib/Console.js";

const logger = new Console("APP");

// Importar Rutas
import professorRoutes from "./routes/professorRoute.js";


//Inicializar express para las consultas HTTP
const app = express();

// Middlewares
app.use(cors({credentials: true, origin: "*"})); //Permite el acceso desde cualquier origen
app.use(express.json({limit: "70mb"})) //Permite hasta 70mb de datos en formato JSON
app.use(cookieParser()); //Analiza las cookies junto las solicitudes entrantes al API
app.use(morgan("dev")); //Ayuda a depurar las peticiones HTTP.

// Rutas
app.use("/api", professorRoutes); //Ruta al API de profesor.

//Manejo de errores generales
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Error interno en el servidor.');
});


export default app;