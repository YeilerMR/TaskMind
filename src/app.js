import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

import Console from "./Lib/Console.js";
import professorRoutes from "./routes/professor.routes.js";
import courseRoutes from "./routes/course.routes.js";
import noteRoutes from "./routes/notes.routes.js";

const logger = new Console("APP");

const app = express();

// Cargar documentos Swagger
const loadSwaggerDoc = (filePath) => {
    try {
        const file = fs.readFileSync(filePath, 'utf8');
        return YAML.parse(file);
    } catch (error) {
        logger.error(`Error loading Swagger doc: ${error.message}`);
        process.exit(1);
    }
};

const professorDoc = loadSwaggerDoc('./swagger/professor.yml');
const courseDoc = loadSwaggerDoc('./swagger/course.yml');


// Configurar Swagger UI con múltiples especificaciones
const options = {
    explorer: true,
    swaggerOptions: {
        urls: [
            {
                url: '/api-docs/professor.json',
                name: 'Professors'
            },
            {
                url: '/api-docs/course.json',
                name: 'Courses'
            }
            ,
            {
                url: '/api-docs/note.json',
                name: 'Notes'
            }
        ]
    }
};

// Middlewares
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json({ limit: "70mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Rutas para documentos Swagger
app.get('/api-docs/professor.json', (req, res) => {
    res.json(professorDoc);
});

app.get('/api-docs/course.json', (req, res) => {
    res.json(courseDoc);
});



// Ruta principal de Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(null, options));

// Rutas de la aplicación
app.use("/api/professor", professorRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notes", noteRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Error interno en el servidor.');
});

export default app;