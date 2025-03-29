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

const connectionSettings = {
dialect: "mssql",
host: "localhost",
port: parseInt(1433, 10),
database: "taskmind_db",
username: "elian",
password: "1234",
dialectOption: {
  options: {
    encrypt: "true",
    trustServerCertificate: "true",
  },
},
logging: false,
};

//Funcion para realizar la conexion a la base de datos
const dbConnection = new Sequelize(connectionSettings)

export default dbConnection;
