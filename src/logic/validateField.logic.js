
function isNotEmpty(value) {
    if(typeof value === 'string'){
        return value.trim().length > 0;

    }else if (typeof value === 'number') {
        return !isNaN(value);
    }
    return false;
}

export const validateRegisterUser = (req) => {
    const {
        DSC_FIRST_NAME,DSC_LAST_NAME_ONE, DSC_EMAIL,DSC_PASSWORD,
        DSC_CAREER
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_FIRST_NAME, name: 'NOMBRE_USUARIO' },
        { field: DSC_LAST_NAME_ONE, name: 'APELLIDO' },
        { field: DSC_EMAIL, name: 'CORREO' },
        { field: DSC_PASSWORD, name: 'CONTRASEÑA'},
        { field: DSC_CAREER, name: 'CARRERA' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }
    return errors.length > 0 ? errors : true;
};


export const validateUpdateUser = (req) => {
    const {
        DSC_FIRST_NAME, DSC_LAST_NAME_ONE, DSC_CAREER
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_FIRST_NAME, name: 'Nombre' },
        { field: DSC_LAST_NAME_ONE, name: 'Apellido' },
        { field: DSC_CAREER, name: 'Descripcion de Carrera' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }
    return errors.length > 0 ? errors : true;
};