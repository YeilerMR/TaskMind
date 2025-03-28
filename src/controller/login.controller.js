import { getDateCR } from '../Lib/date.js';
import User from '../model/user.model.js';
import { encryptData, compareData } from "../Lib/encryptData.js";


export const login = async (req, res) => {
    try {
      const { DSC_EMAIL, DSC_PASSWORD } = req.body;
  
      const userFound = await User.findOne({
        where: {
            DSC_EMAIL: DSC_EMAIL,
            STATUS: 1
        }
      });
      if (!userFound)
        return res.status(400).json({
          message: ["Error al procesar la solicitud"],
        });
  
      const isMatch = await compareData(DSC_PASSWORD, userFound.DSC_PASSWORD);
      if (!isMatch) {
        return res.status(400).json({
            message: ["Error al procesar la solicitud"],
        });
      }
  
      res.status(200).json({
        ID_USER: userFound.ID_USER,
        DSC_FIRST_NAME: userFound.DSC_FIRST_NAME,
        DSC_LAST_NAME_ONE:userFound.DSC_LAST_NAME_ONE,
        DSC_EMAIL: userFound.DSC_EMAIL,
        DSC_CAREER: userFound.DSC_CAREER,
        message: `Bienvenido de nuevo, ${userFound.DSC_FIRST_NAME}!`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };