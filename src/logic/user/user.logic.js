import User from '../../model/user.model.js';
import { validateRegisterUser, validateUpdateUser } from '../validateField.logic.js';
import { Op } from 'sequelize';
import { getDateCR } from '../../Lib/date.js';
import { userServices } from '../../services/userServices.js';
import { encryptData, compareData } from '../../Lib/encryptData.js'
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from '../../config.js';


export const validateRegister = async (DSC_EMAIL) => {
    try {
        const output = await existData(DSC_EMAIL);
        return (output !== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const validateRegisterUpdate = async (DSC_EMAIL,ID_USER) => {
    try {
        const output = await existDataUpdate(DSC_EMAIL,ID_USER);
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

async function existDataUpdate(email,ID_USER) {
    if (await existEmailForUpdate(email,ID_USER))
        return ["El correo ya se encuentra en uso."];


    return false;
}

async function existEmail(email) {
    const emailFound = await User.findOne({ where: { DSC_EMAIL: email.toLowerCase() } });
    if (emailFound)
        return true;
    return false;
}

async function existEmailForUpdate(email, currentUserId) {
    const emailFound = await User.findOne({
        where: {
            DSC_EMAIL: email.toLowerCase(),
            DSC_IDENTIFICATION: { [Op.ne]: currentUserId } 
        }
    });

    return !!emailFound; // true si existe, false si no
}

async function exist_Id_User(DSC_IDENTIFICATION) {
    const user = await User.findOne({ where: { DSC_IDENTIFICATION: DSC_IDENTIFICATION } });
    return (!user) ? true : "La cedula se encuentra registrada en el sistema.";
}

async function exist_User(DSC_IDENTIFICATION) {
    const user = await User.findOne({ where: { DSC_IDENTIFICATION: DSC_IDENTIFICATION } });
    return (user) ? user : "Usuario no encontrado";
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

        const user = await exist_Id_User(DSC_IDENTIFICATION);
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



export async function messageDelete(result, res,token) {
    if (result) {
       

        if (token) {
            return jwt.verify(token, TOKEN_SECRET, async (error, user) => {
                if (error) return res.sendStatus(401);

                const userFound = await User.findOne({ where: { DSC_IDENTIFICATION: user.id } });
                if (!userFound) return res.sendStatus(401);

                res.cookie("token", "", {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(0),
                });

                 res.status(200).json({ message: 'Usuario deshabilitado y sesión cerrada correctamente' });
            });
        }

    }

     res.status(400).json({ message: 'Error al deshabilitar los usuarios' });
}

// delete user function
export const delete_User = async (req, res) => {
    try {
        const { token } = req.cookies;
        const id = req.params.id;

        const user = await exist_User(id);
        if (typeof user === 'string') {
            return res.status(400).json({
                message: user,
            })
        }

        const result = await userServices.delectUser(user);

        messageDelete(result, res,token);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


function message_Update(result, res) {
    const response = result
        ? { status: 200, message: 'Usuario actualizado correctamente' }
        : { status: 400, message: 'Error al actualizar los usuarios' };

    return res.status(response.status).json({ message: response.message });
}

export const update_User = async (req, res) => {
    try {
        const {DSC_FIRST_NAME, DSC_LAST_NAME_ONE,DSC_EMAIL, DSC_CAREER } = req.body;
           
            const { id } = req.params
        const validateFields = validateUpdateUser(req);
        if (validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            })
        }

        const user = await exist_User(id);
        if (typeof user === 'string') {
            return res.status(400).json({
                message: user,
            })
        }


        const output = await validateRegisterUpdate(DSC_EMAIL,id);
        if (output !== true) {
            return res.status(400).json({
                message: output,
            })
        }

    
        const newUser = {
            DSC_FIRST_NAME,
            DSC_LAST_NAME_ONE,
            DSC_EMAIL: DSC_EMAIL,
            DSC_CAREER,
        };

        const result = await userServices.updateUser(id,newUser);

        message_Update(result,res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
