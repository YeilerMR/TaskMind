import Professor from "../model/professorModel.js";
import Console from "../Lib/Console.js";
import Course from "../model/course.model.js";
import { Op } from "sequelize";

const logger = new Console("P_CONTROLLER");

function isNotEmpty(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  } else if (typeof value === "number") {
    return !isNaN(value);
  }
  return false;
}
export const getAllProfessors = async (req, res) => {
  try {
    //Parametros para paginacion (No necesario)
    const {
      page = 1,
      pageSize = 5,
      orderByField = "DSC_FIRST_NAME",
      order = "asc",
    } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    //Validar los campos de ordenamiento
    const field = [
      "DSC_FIRST_NAME",
      "DSC_LAST_NAME_ONE",
      "DSC_EMAIL",
      "STATUS",
    ].includes(orderByField)
      ? orderByField
      : "DSC_FIRST_NAME"; //Campo de ordenamiento por default.

    //Validar el orden
    const sortOrder = ["asc", "desc"].includes(order.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    //Consulta a la base de datos
    const { count, rows } = await Professor.findAndCountAll({
      where: {
        STATUS: 1, // Solo profesores activos
      },
      limit,
      offset,
      order: [
        [field, sortOrder], // ordena segun el campo y el orden especificados
      ],
      distinct: true, // Asegura que el conteo sea preciso cuando haya relacion
    });

    //Si no encuentra profesores, retorna el mensaje
    if (rows.length === 0) {
      const message = "No hay profesores registrados.";
      logger.warning(message);
      return res.status(204).json({
        message: message,
      });
    }

    //Retorna la lista con los profesores registrados
    res.json({
      total: count,
      totalPage: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      professors: rows,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const registerProfessor = async (req, res) => {
  try {
    const {
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    } = req.body;
    if (
      !isNotEmpty(DSC_FIRST_NAME) ||
      !isNotEmpty(DSC_LAST_NAME_ONE) ||
      !isNotEmpty(DSC_EMAIL) ||
      !isNotEmpty(DSC_PHONE) ||
      !isNotEmpty(STATUS)
    ) {
      logger.error("Campos incompletos");
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const professorSave = await Professor.create({
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    });

    res.json({
      status: 200,
      message: "Profesor registrado correctamente",
      professor: professorSave,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// export const getAllProfessors = async (req, res) => {
//   try {
//     // Lógica para obtener todos los profesores
//     const professors = await Professor.findAll();
//     res.json(professors);
//     logger.success("Todos los profesores obtenidos.");
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const deleteProfessor = async (req, res) => {
  try {
    const professor = await Professor.findOne({
      where: { ID_TEACHER: req.params.id },
    });

    if (!professor) {
      logger.error("No se encontro el profesor");
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    const professorName = professor.DSC_FIRST_NAME;
    logger.info("Info del profesor: " + professorName);

    await professor.update({
      STATUS: 0,
    });
    logger.success("Profesor[" + professorName + "] eliminado correctamente");
    return res
      .status(200)
      .json({ message: "Profesor eliminado correctamente" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfessor = async (req, res) => {
  try {
    const {
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    } = req.body;
    logger.info("info del profesor: " + req.body);

    const professor = await Professor.findByPk(req.params.id);
    if (!professor) {
      logger.error("No se encontro el profesor");
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    const updateData = {
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    };

    await professor.update(updateData);
    logger.success("Profesor actualizado correctamente");
    return res
      .status(200)
      .json({
        message: "Profesor actualizado correctamente",
        professor: professor,
      });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const searchProfessor = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 5,
      termSearch = "",
      orderByField = "DSC_NAME",
      order = "asc",
    } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field = [
      "DSC_FIRST_NAME",
      "DSC_LAST_NAME_ONE",
      "DSC_LAST_NAME_TWO",
      "DSC_EMAIL",
      "STATUS",
    ].includes(orderByField)
      ? orderByField
      : "DSC_FIRST_NAME";

    const sortOrder =
      order.toLowerCase() === "asc" || order.toLowerCase() === "desc"
        ? order
        : "asc";
    const expectedMatch = { [Op.like]: `%${termSearch}%` };

    const { count, rows } = await Professor.findAndCountAll({
      limit,
      offset,
      order: [[field, sortOrder]],
      where: {
        [Op.or]: [
          { DSC_FIRST_NAME: expectedMatch },
          { DSC_LAST_NAME_ONE: expectedMatch },
          { DSC_LAST_NAME_TWO: expectedMatch },
          { DSC_EMAIL: expectedMatch },
          { STATUS: expectedMatch },
        ],
      },
    });

    if (rows.length === 0) {
      const message =
        "No se encontraron profesores con los criterios de búsqueda.";
      logger.warning(message);
      return res.status(204).json({
        message: message,
        total: 0,
        currentPage: parseInt(page),
        pageSize: limit,
        professors: [],
      });
    }
    res.json({
      total: count,
      totalPage: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      professors: rows,
    });
  } catch (error) {
    logger.error("Error al buscar profesor: " + error);
    return res.status(500).json({ message: error.message });
  }
};
