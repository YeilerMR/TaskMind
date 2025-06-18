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
import userRoutes from "./routes/user.routes.js";
import loginRoute from "./routes/logic.routes.js"
import evaluationRoute from "./routes/evaluation.routes.js";
import studentEvaluationRoute from "./routes/student.evaluation.routes.js";

const logger = new Console("APP");

const app = express();

// Load Swagger Docs
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
const userDoc = loadSwaggerDoc('./swagger/user.yml');
const loginDoc = loadSwaggerDoc('./swagger/login.yml');
const noteDoc = loadSwaggerDoc('./swagger/note.yml');
const evaluationDoc = loadSwaggerDoc('./swagger/evaluation.yml');
const studentEvaluationDoc = loadSwaggerDoc('./swagger/student-evaluation.yml');

// configure swagger UI
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
            },
            {
                url: '/api-docs/user.json',
                name: 'Users'
            },
            {
                url: '/api-docs/login.json',
                name: 'Login'
            }
            ,
            {
                url: '/api-docs/note.json',
                name: 'Notes'
            },
            {
                url: '/api-docs/evaluation.json',
                name: 'Evaluations'
            },
            {
                url: '/api-docs/student-evaluation.json',
                name: 'Student Evaluations'
            }
        ]
    }
};

// Middlewares
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json({ limit: "70mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes for Swagger docs
app.get('/api-docs/professor.json', (req, res) => {
    res.json(professorDoc);
});

app.get('/api-docs/course.json', (req, res) => {
    res.json(courseDoc);
});


app.get('/api-docs/user.json', (req, res) => {
    res.json(userDoc);
});

app.get('/api-docs/login.json', (req, res) => {
    res.json(loginDoc);
});

app.get('/api-docs/note.json', (req, res) => {
    res.json(noteDoc);
});

app.get('/api-docs/evaluation.json', (req, res) => {
    res.json(evaluationDoc);
});

app.get('/api-docs/student-evaluation.json', (req, res) => {
    res.json(studentEvaluationDoc);
})

// principal routes for swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(null, options));

// Application routes
app.use("/api/professor", professorRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/Auth", loginRoute);
app.use("/api/evaluation", evaluationRoute);
app.use("/api/student-evaluation", studentEvaluationRoute);
// Error management
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Error interno en el servidor.');
});

export default app;