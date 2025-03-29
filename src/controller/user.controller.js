import { getDateCR } from '../Lib/date.js';
import User from '../model/user.model.js';
import { validateRegisterUser, validateUpdateUser } from '../logic/validateField.logic.js';
import { validateRegister } from '../logic/user/user.logic.js';
import { encryptData, compareData } from "../Lib/encryptData.js";
import { format } from 'date-fns-tz';


export const registerUsers = async (req, res) => {
  try {
    const { DSC_FIRST_NAME, DSC_LAST_NAME_ONE, DSC_EMAIL, DSC_PASSWORD, DSC_CAREER, CONFIRM_PASSWORD } = req.body;

    const validateFields = validateRegisterUser(req);
    if (validateFields !== true) {
      return res.status(400).json({
        message: validateFields,
      })
    }

    const output = await validateRegister(DSC_EMAIL);
    if (output !== true) {
      return res.status(400).json({
        message: output,
      })
    }

    if (DSC_PASSWORD !== CONFIRM_PASSWORD) {
      return res.status(400).json({
        message: 'Las contraseñas no coinciden.',
      })
    }

    const passwordHash = await encryptData(DSC_PASSWORD, 10);

    const DATE_CREATED = await getDateCR();

    const newUser = new User({
      DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE,
      DSC_EMAIL: DSC_EMAIL.toLowerCase(),
      DSC_PASSWORD: passwordHash,
      DATE_CREATED,
      STATUS: 1,
      DSC_CAREER,
    });
    const userSaved = await newUser.save();

    res.status(200).json({
      ID_USER: userSaved.ID_USER,
      DSC_FIRST_NAME: userSaved.DSC_FIRST_NAME,
      DSC_LAST_NAME_ONE: userSaved.DSC_LAST_NAME_ONE,
      DSC_EMAIL: userSaved.DSC_EMAIL,
      DSC_CAREER: userSaved.DSC_CAREER,
      message: 'Registro realizado correctamente.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateUser = async (req, res) => {
  try {
    const {
      DSC_FIRST_NAME, DSC_LAST_NAME_ONE, DSC_PASSWORD, CONFIRM_PASSWORD, DSC_CAREER } = req.body;

    const validateFields = validateUpdateUser(req);
    if (validateFields !== true) {
      return res.status(400).json({
        message: validateFields,
      })
    }

    const user = await User.findOne({ where: { ID_USER: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: "Error al cargar el usuario." });
    }

    if (DSC_PASSWORD !== CONFIRM_PASSWORD) {
      return res.status(400).json({
        message: 'Las contraseñas no coinciden.',
      })
    }

    var passwordHash;
    if (DSC_PASSWORD) {
      passwordHash = await encryptData(DSC_PASSWORD, 10);
    } else {
      passwordHash = user.DSC_PASSWORD;
    }
    await user.update({
      DSC_FIRST_NAME, DSC_LAST_NAME_ONE, DSC_PASSWORD: passwordHash, DSC_CAREER,
    });

    return res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const deleteUser = async (req, res) => {
  try {

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }
    if (id <= 0) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const user = await User.findOne({ where: { ID_USER: id } });
    if (!user) {
      return res.status(404).json({ message: "Error al cargar el usuario." });
    }

    user.STATUS = 0;
    await user.save();

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};