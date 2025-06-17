import { createEvaluationLogic, updateEvaluationLogic, getEvaluationsByUserID} from "../logic/evaluation.logic.js";
import Course from "../model/course.model.js";
import Notes from "../model/note.model.js";
import User from "../model/user.model.js";
import { Op } from 'sequelize';
import Console from "../Lib/Console.js";
import {getDateCR} from "../Lib/date.js";

export const registerEvaluation = async (req, res) => {
    try {
           const { error, success, evaluation } = await createEvaluationLogic(req.body);
   
           if (error) return res.status(400).json({ message: error });
   
           res.json({ status: 200, evaluation, message: "Evaluacion creada exitosamente" });
       } catch (error) {
           logger.error("Error al registrar la Evaluacion: " + error.message);
           res.status(500).json({ message: error.message });
       }
   };

   export const updateEvaluation = async (req, res) => {
     try {
       updateEvaluationLogic(req,res);
     } catch (error) {
       return res.status(500).json({ message: error.message });
     }
   };

    export const evaluationsByUserID = async (req, res) => {
    try {
      getEvaluationsByUserID(req,res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
   };
   