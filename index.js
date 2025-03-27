
// import dbConnection from "./src/database/dbConnection.js";
import Console from "./src/Lib/Console.js";
import app from "./src/app.js";

const logger = new Console('INDEX');
const PORT = 4000

async function main() {
    try {
        app.listen(PORT);
        logger.success(`Escuchando en el puerto ${PORT}`);
    } catch (error) {
        logger.error(error);
    }
}

main();


