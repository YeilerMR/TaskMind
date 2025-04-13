import { user_Register } from '../logic/user/user.logic.js';
import User from '../model/user.model.js';
import { encryptData, compareData } from '../Lib/encryptData.js'
import { validateUpdateUser } from '../logic/validateField.logic.js';

// import { format } from 'date-fns-tz';


export const registerUsers = async (req, res) => {
  try {
    user_Register(req, res);
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

    const user = await User.findOne({ where: { DSC_IDENTIFICATION: req.params.id } });
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

    const id = req.params.id;

    const user = await User.findOne({ where: { DSC_IDENTIFICATION: id } });
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