import Professor from "../model/professorModel.js";
import Console from "../Lib/Console.js";

const logger = new Console("P_CONTROLLER");

// export const getAllProfessors = async (req, res) => {
//     try {
//         //Parametros para paginacion (No necesario)
//         const { page = 1, pageSize = 5, orderByField = 'DSC_FIRST_NAME', order = 'asc' } = req.;
//         const limit = parseInt(pageSize);
//         const offset = (parseInt(page) - 1) * limit;

//         //Validar los campos de ordenamiento
//         const field = ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_EMAIL', 'STATUS'].includes(orderByField)
//         ? orderByField
//         : 'DSC_FIRST_NAME'; //Campo de ordenamiento por default.

//         //Validar el orden
//         const sortOrder = ['asc', 'desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

//         //Consulta a la base de datos
//         const {count, rows} = await Professor.findAndCountAll({
//             // attributes: {
//             //     exclude: []
//             // }
//             limit, offset, order: [
//                 [field, sortOrder],// ordena segun el campo y el orden especificados
//             ], 
//             distinct: true // Asegura que el conteo sea preciso cuando haya relacion
//         });

//         //Si no encuentra profesores, retorna el mensaje
//         if (rows.length === 0) {
//             const message = 'No hay profesores registrados.';
//             logger.warning(message);
//             return res.status(204).json({
//                 message: message,
//             });
           
//         }

//         //Retorna la lista con los profesores registrados
//         res.json({
//             total: count,
//             totalPage: Math.ceil(count / limit),
//             currentPage: parseInt(page),
//             pageSize: limit,
//             professors: rows
//         });

//     } catch (error) {
//         logger.error(error);
//         return res.status(500).json({ message: error.message});
//     }
//};
export const getAllProfessors = async (req, res) => {
    try {
        // Lógica para obtener todos los profesores
        const professors = await Professor.findAll();
        res.json(professors);
        logger.success("Todos los profesores obtenidos.");
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: error.message });
    }
};
