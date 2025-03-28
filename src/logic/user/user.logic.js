import User from '../../model/user.model.js';
import { Op } from 'sequelize';

export const validateRegister = async (DSC_EMAIL) => {
    try {
        const output = await existData(DSC_EMAIL);
        return (output !== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
};



// metodos para validación


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

