import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';

dotenv.config();

/*const connectionSettings = {
  dialect: "mssql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectOption: {
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
  },
  logging: false,
};*/


//Funcion para realizar la conexion a la base de datos
const dbConnection = new Sequelize('taskmind_db', 'elian', '1234', {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true, // Necesario para entornos locales/dev
    
    },
  },
  port: 62947, // Verifica que sea el puerto correcto (netstat -ano | findstr 62947)

  logging: console.log, // Habilita logs para diagnóstico
  retry: { // Reintentos automáticos
    max: 3, // Máximo de reintentos
    match: [/ECONNRESET/, /SequelizeConnectionError/], // Reintenta en estos errores
  },
});

export default dbConnection;
