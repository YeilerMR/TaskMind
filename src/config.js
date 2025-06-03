// API
export const PORT = process.env.PORT || 4000;

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

// FRONT-END
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4000";

// DATABASE
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 1433;
const database = process.env.DB_NAME || 'taskmind_db';
const user = process.env.DB_USER || 'sa';
const password = process.env.DB_PASSWORD || '';
const encrypt = process.env.DB_ENCRYPT === 'true';
const trustServerCertificate = process.env.DB_TRUST_SERVER_CERTEFICATE === 'true';

export const MSSQL_CONFIG = {
  server: host,
  port: parseInt(port, 10),
  database,
  user,
  password,
  options: {
    encrypt,
    trustServerCertificate,
  },
};
