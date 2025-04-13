import User from '../../model/user.model.js';
import { validateRegisterUser, validateUpdateUser } from '../validateField.logic.js';
import { Op } from 'sequelize';
import { getDateCR } from '../../Lib/date.js';
import { userServices } from '../../services/userServices.js';
import { encryptData, compareData } from '../../Lib/encryptData.js'


export const validateRegister = async (DSC_EMAIL) => {
    try {
        const output = await existData(DSC_EMAIL);
        return (output !== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
};

// validations methods
async function existData(email) {
    if (await existEmail(email))
        return ["El correo ya se encuentra en uso."];


    return false;
}

async function existEmail(email) {
    const emailFound = await User.findOne({ where: { DSC_EMAIL: email.toLowerCase() } });
    if (emailFound)
        return true;
    return false;
}

async function existe_Id_User(DSC_IDENTIFICATION) {
    const user = await User.findOne({ where: { DSC_IDENTIFICATION: DSC_IDENTIFICATION } });
    return (!user) ? true : "La cedula se encuentra registrada en el sistema.";
}
export function validate_Passwords(password, confirmPassword) {
    return password === confirmPassword;
}

async function validate_status_user(result, res) {

    if (result && result.DSC_IDENTIFICATION) {
        return res.status(200).json({
            ID_USER: result.DSC_IDENTIFICATION,
            DSC_FIRST_NAME: result.DSC_FIRST_NAME,
            DSC_LAST_NAME_ONE: result.DSC_LAST_NAME_ONE,
            DSC_EMAIL: result.DSC_EMAIL,
            DSC_CAREER: result.DSC_CAREER,
            message: 'Registro realizado correctamente.',
        });
    }

    const errorMessages = {
        1: 'Error: El email ya está registrado',
        2: 'Error: Datos inválidos',
        0: 'Error desconocido',
    };


    return res.status(400).json({ message: errorMessages[result] || 'Error desconocido' });
}


export const user_Register = async (req, res) => {
    try {
        const { DSC_FIRST_NAME, DSC_LAST_NAME_ONE, DSC_IDENTIFICATION, DSC_EMAIL, DSC_PASSWORD, DSC_CAREER, CONFIRM_PASSWORD } = req.body;

        const validateFields = validateRegisterUser(req);
        if (validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            })
        }

        const user = await existe_Id_User(DSC_IDENTIFICATION);
        if (user !== true) {
            return res.status(400).json({
                message: user,
            })
        }


        const output = await validateRegister(DSC_EMAIL);
        if (output !== true) {
            return res.status(400).json({
                message: output,
            })
        }

        if (!validate_Passwords(DSC_PASSWORD, CONFIRM_PASSWORD)) {
            return res.status(400).json({
                message: 'Las contraseñas no coinciden.',
            })
        }

        const passwordHash = await encryptData(DSC_PASSWORD, 10);

        const DATE_CREATED = await getDateCR();

        const newUser = {
            DSC_FIRST_NAME,
            DSC_LAST_NAME_ONE,
            DSC_IDENTIFICATION,
            DSC_EMAIL: DSC_EMAIL.toLowerCase(),
            DSC_PASSWORD: passwordHash,
            DATE_CREATED,
            STATUS: 1,
            DSC_CAREER,
        };

        const userSaved = await userServices.createUser(newUser);

        validate_status_user(userSaved, res)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};