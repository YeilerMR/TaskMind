// Importar chalk usando ES Modules
import chalk from 'chalk';

// Definir la clase Console
class Console {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }

    success(message) {
        console.log(`${chalk.bgGreen(`[${this.moduleName}]`)} ${chalk.gray(new Date().toUTCString())} ${message}`);
    }

    warning(message) {
        console.log(`${chalk.bgYellow(`[${this.moduleName}]`)} ${chalk.gray(new Date().toUTCString())} ${message}`);
    }

    error(message) {
        console.log(`${chalk.bgRed(`[${this.moduleName}]`)} ${chalk.gray(new Date().toUTCString())} ${message}`);
    }
}

// Exportar la clase usando ES Modules
export default Console;