import dbConnection from "../../database/dbConnection.js";


export const initHomePage = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'Falta la cédula (userId)' });
        }

        // Ejecutar el procedimiento almacenado que devuelve varios resultados
        const results = await dbConnection.query(
            `EXEC Sp_init_Home_Page @IDENT = :ident`,
            {
                replacements: { ident: userId },
                type: dbConnection.QueryTypes.SELECT,
                raw: true,
            }
        );

        // Verificar los resultados
        console.log('Results:', results); // Verifica el formato de los resultados

        // Validar que al menos 'results' tenga información
        if (!results || results.length === 0) {
            return res.status(204).json({ message: "No se encontró información para esta cédula." });
        }

        const resumenCursos = results[0] || {}; 
        const evaluacionesProximas = results.length > 0 ? results.slice(1) : []; 

        return res.status(200).json({
            resumenCursos,
            evaluacionesProximas
        });

    } catch (error) {
        console.error('Error al inicializar Home Page:', error);
        return res.status(500).json({ message: error.message });
    }
};

