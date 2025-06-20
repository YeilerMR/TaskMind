import { createEvaluationLogic, updateEvaluationLogic, getEvaluationsByUserID, deleteEvaluationLogic} from "../logic/evaluation.logic.js";
import Console from "../Lib/Console.js";

const logger = new Console("EVALUATION-CONTROLLER");

export const registerEvaluation = async (req, res) => {
   try {
       createEvaluationLogic(req, res);
     } catch (error) {
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
   

   export const deleteEvaluation = async (req, res) => {
     try {
      deleteEvaluationLogic(req,res);  
     } catch (error) {
       return res.status(500).json({ message: error.message });
     }
   };