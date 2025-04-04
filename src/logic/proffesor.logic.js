import Professor from "../model/professorModel.js";
import { Op } from "sequelize";
import Console from "../Lib/Console.js";

const logger = new Console("P_CONTROLLER");

function isNotEmpty(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  } else if (typeof value === "number") {
    return !isNaN(value);
  }
  return false;
}

// function to get all professors
export const getProfessors = async (req) => {
  try {
    // Pagination params
    const {
      page = 1,
      pageSize = 5,
      orderByField = "DSC_FIRST_NAME",
      order = "asc",
    } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;
    
    const field = [
      "DSC_FIRST_NAME",
      "DSC_LAST_NAME_ONE",
      "DSC_EMAIL",
      "STATUS",
    ].includes(orderByField)
      ? orderByField
      : "DSC_FIRST_NAME";

    // validation for order
    const sortOrder = ["asc", "desc"].includes(order.toLowerCase())
      ? order.toLowerCase()
      : "asc";
    
    const { count, rows } = await Professor.findAndCountAll({
      where: {
        STATUS: 1, 
      },
      limit,
      offset,
      order: [
        [field, sortOrder],
      ],
      distinct: true,
    });

    if (rows.length === 0) {
      const message = "No hay profesores registrados.";
      logger.warning(message);
      return { message: message, status: 204 };
    }
    
    return {
      success: true,
      data: {
        total: count,
        totalPage: Math.ceil(count / limit),
        currentPage: parseInt(page),
        pageSize: limit,
        professors: rows,
      },
      status: 200,
    };
  } catch (error) {
    logger.error(error);
    return { status: 500, error: error };
  }
};

// add new professor
export const addProfessor = async (req) => {
  var message = "Todos los campos son necesarios";
  try {
    const {
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    } = req.body;
    logger.info("Datos recividos de la peticion: ", req.DSC_FIRST_NAME);

    // validations for empty fields
    if (
      !isNotEmpty(DSC_FIRST_NAME) ||
      !isNotEmpty(DSC_LAST_NAME_ONE) ||
      !isNotEmpty(DSC_EMAIL) ||
      !isNotEmpty(DSC_PHONE) ||
      !isNotEmpty(STATUS)
    ) {
      logger.error("Campos incompletos");
      return { status: 400, message: message };
    }

    const saveProfessor = await Professor.create({
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    });

    message = "Profesor registrado correctamente";
    logger.success(message);
    return {
      status: 201,
      message: message,
      data: saveProfessor,
    };
  } catch (error) {
    message = "Error: " + error.message;
    logger.error(error);
    return { status: 500, error: message };
  }
};

// delete an existing professor
export const eliminateProfessor = async (req) => {
  try {
    let message = "Profesor no encontrado";
    const professor = await Professor.findOne({
      where: { ID_TEACHER: req.params.id },
    });

    if (!professor) {
      logger.error("No se encontro el profesor");
      return { status: 404, message: message };
    }
    const professorName = professor.DSC_FIRST_NAME;
    logger.info("Info del profesor: " + professorName);

    await professor.update({
      STATUS: 0,
    });
    logger.success("Profesor[" + professorName + "] eliminado correctamente");
    message = "Profesor [" + professorName + "] eliminado correctamente";
    return { status: 200, message: message };
  } catch (error) {
    logger.error(error);
    return { status: 500, message: error.message };
  }
};

// update and existing professor
export const modifyProfessor = async (req) => {
  try {
    const {
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_LAST_NAME_TWO,
      DSC_EMAIL,
      DSC_PHONE,
      STATUS,
    } = req.body;
    logger.info("Informacion del profesor: ", req.body);

    const professor = await Professor.findByPk(req.params.id);
    if (!professor) {
      logger.error("No se encontro el profesor");
      return { status: 404, message: "Profesor no encontrado" };
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
    return { status: 200, message: "Profesor actualizado correctamente" };
  } catch (error) {
    logger.error(error.message);
    return { status: 500, message: error.message };
  }
};

// search proffessor by term
export const findProfessor = async (req) => {
  try {
    const {
      page = 1,
      pageSize = 5,
      termSearch = "",
      orderByField = "DSC_NAME",
      order = "asc",
    } = req.query;

    if (
      !termSearch ||
      typeof termSearch !== "string" ||
      termSearch.trim() === ""
    ) {
      const message = "El término de búsqueda es obligatorio.";
      logger.warning(message);
      return res.status(400).json({ message });
    }
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
        [Op.and]: [
          { STATUS: 1 },
          {
            [Op.or]: [
              { DSC_FIRST_NAME: expectedMatch },
              { DSC_LAST_NAME_ONE: expectedMatch },
              { DSC_LAST_NAME_TWO: expectedMatch },
              { DSC_EMAIL: expectedMatch },
              { STATUS: expectedMatch },
            ],
          },
        ],
      },
    });

    if (rows.length === 0) {
      const message =
        "No se encontraron profesores con los criterios de búsqueda.";
      logger.warning(message);
      return {
        success: false,
        data: {
          message: message,
          total: 0,
          currentPage: parseInt(page),
          pageSize: limit,
          professors: [],
        },
        status: 204
      };
    }

    return {
        success: true,
        data: {
            total: count,
            totalPage: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            professors: rows,
        },
        status: 200
      };


  } catch (error) {
    logger.error("Error al buscar profesor: " + error);
    return {success: false, error: error.message};
  }
};
