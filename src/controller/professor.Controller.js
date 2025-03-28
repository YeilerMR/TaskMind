import Professor from "../model/professorModel.js";
import Console from "../Lib/Console.js";
import Course from "../model/course.model.js";
import { Op } from "sequelize";
import {
  getProfessors,
  addProfessor,
  eliminateProfessor,
  modifyProfessor,
  findProfessor
} from "../logic/proffesor.logic.js";

const logger = new Console("P_CONTROLLER");

export const getAllProfessors = async (req, res) => {
  const result = await getProfessors(req);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }
  return res.status(200).json({ success: true, data: result.data });
};

export const registerProfessor = async (req, res) => {
  const result = await addProfessor(req);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }
  return res.status(200).json({ success: true, data: result.data });
};

export const deleteProfessor = async (req, res) => {
  const result = await eliminateProfessor(req);
  if (result.error) {
    return res.status(404).json({success: false, message: result.message });
  }
  return res.status(200).json({ success: true, message: result.message });
};

export const updateProfessor = async (req, res) => {
  const result = await modifyProfessor(req);
  if (result.error) {
    return res.status(404).json({success: false, message: result.message });
  }
  return res.status(200).json({ success: true, message: result.message });
};

export const searchProfessor = async (req, res) => {
  const result = await findProfessor(req);
  if (result.error) {
    return res.status(404).json({ success: false, message: result.message });
  }
  return res.status(200).json({ success: true, data: result.data });
};
