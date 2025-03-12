require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const axios = require("axios");

const app = express();
const apiKey = process.env.API_KEY;
const baseUrl = "https://openrouter.ai/api/v1/chat/completions";

app.use(fileUpload());
app.use(express.json());

// Función para purgar el texto
function purgarTexto(texto) {
    const textoMinusculas = texto.toLowerCase();

    const cronogramText = ["vii.  cronograma", "vii. cronograma"];


    console.log("[TEXTO EN MINUSCULAS]", textoMinusculas);
    // Buscar "descripción" y "vii. cronograma"
    const indiceDescripcion = textoMinusculas.indexOf("descripción");//i. descripción
    const indiceCronograma = textoMinusculas.indexOf("vii.  cronograma");//vii.  cronograma

    let primeraPagina = "";
    let cronograma = "";

    // Extraer la primera página hasta "descripción"
    if (indiceDescripcion !== -1) {
        primeraPagina = texto.slice(0, indiceDescripcion);
    } else {
        primeraPagina = texto; // Si no se encuentra "descripción", tomar todo el texto
    }

    // Extraer el cronograma desde "vii. cronograma"
    if (indiceCronograma !== -1) {
        cronograma = texto.slice(indiceCronograma);
    }

    // Unir las partes relevantes
    const textoPurgado = primeraPagina + "\n" + cronograma;

    // Eliminar líneas vacías y espacios innecesarios
    const textoLimpio = textoPurgado.replace(/^\s*[\r\n]/gm, "");

    return textoLimpio;
}
// Ruta para subir el PDF
app.post("/upload", async (req, res) => {
    if (!req.files || !req.files.pdf) {
        return res.status(400).send("No se subió ningún archivo.");
    }

    try {
        const pdfFile = req.files.pdf;
        const data = await pdf(pdfFile.data);
        const textoDelPDF = data.text;

        if (!textoDelPDF || textoDelPDF.trim() === "") {
            return res.status(400).send("El archivo PDF no contiene texto.");
        }

        console.log("Texto extraído del PDF:", textoDelPDF);

        // Purgar el texto del PDF
        const textoPurgado = purgarTexto(textoDelPDF);
        console.log("Texto purgado:", textoPurgado);

        // Enviar el texto purgado a la API
        const info = await extractInfoWithDeepSeek(textoPurgado);

        res.json({ response: info });
    } catch (error) {
        console.error("Error procesando el PDF:", error);
        res.status(500).send("Error procesando el PDF.");
    }
});

// Función para extraer información con DeepSeek
// async function extractInfoWithDeepSeek(text) {
//     const prompt = `
// Eres un asistente especializado en extraer información académica de textos. 
// Analiza el siguiente texto y devuelve un JSON con:
// - "profesor": Nombre completo del profesor (ej: "Dr. Juan Pérez Gómez").
// - "curso": Nombre completo del curso (ej: "Inteligencia Artificial Avanzada").
// - "evaluaciones": Lista de evaluaciones con su fecha, tipo y porcentaje. Ejemplo:
//   [
//     { "fecha": "10/03/2025", "tipo": "Examen Parcial", "porcentaje": 30 },
//     { "fecha": "15/03/2025", "tipo": "Tarea #2", "porcentaje": 10 }
//   ]

// Si no encuentras algún dato, omite el campo. Respuesta solo en JSON, sin explicaciones.

// Texto:
// "${text}"
// `;

//     try {
//         const response = await axios.post(
//             baseUrl,
//             {
//                 model: "deepseek/deepseek-r1-zero:free",
//                 messages: [
//                     { role: "system", content: "Eres un asistente que extrae información estructurada de textos." },
//                     { role: "user", content: prompt },
//                 ],
//                 max_tokens: 10000, // Aumentamos el límite de tokens
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${apiKey}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("Respuesta completa de la API:", JSON.stringify(response.data, null, 2));

//         let rawContent = response.data.choices[0].message.content;
//         console.log("Contenido crudo:", rawContent);

//         // 🔹 Limpiar `\boxed{}` y ```json``` si están presentes
//         rawContent = rawContent.replace(/\\boxed{/, "").replace(/```json/, "").replace(/```/, "").replace(/}$/, "");

//         // 🔹 Validar si el JSON está completo
//         if (!isJsonComplete(rawContent)) {
//             console.warn("El JSON está incompleto. Intentando completar...");
//             rawContent = completeJson(rawContent); // Intenta completar el JSON
//         }

//         // 🔹 Intentar parsear como JSON
//         try {
//             const parsedContent = JSON.parse(rawContent);
//             return parsedContent;
//         } catch (err) {
//             console.warn("Error al parsear JSON, devolviendo texto limpio.");
//             return rawContent; // Si falla, devuelve el texto sin procesar
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error("Error de la API:", error.response.data);
//         } else if (error.request) {
//             console.error("No se recibió respuesta:", error.request);
//         } else {
//             console.error("Error:", error.message);
//         }
//         throw new Error("Error al extraer información con DeepSeek");
//     }
// }

async function extractInfoWithDeepSeek(text) {
    const prompt = `
Eres un asistente especializado en extraer información académica de textos. 
Analiza el siguiente texto y devuelve un JSON con:
- "profesor": Nombre completo del profesor (ej: "Dr. Juan Pérez Gómez").
- "curso": Nombre completo del curso (ej: "Inteligencia Artificial Avanzada").
- "evaluaciones": Lista de evaluaciones con su fecha, tipo y porcentaje. Ejemplo:
  [
    { "fecha": "10/03/2025", "tipo": "Examen Parcial", "porcentaje": 30 },
    { "fecha": "15/03/2025", "tipo": "Tarea #2", "porcentaje": 10 }
  ]

Extrae la información de las evaluaciones del cronograma. Si no encuentras algún dato, omite el campo. Respuesta solo en JSON, sin explicaciones.

Texto:
"${text}"
`;

    try {
        const response = await axios.post(
            baseUrl,
            {
                model: "deepseek/deepseek-r1-zero:free",
                messages: [
                    { role: "system", content: "Eres un asistente que extrae información estructurada de textos." },
                    { role: "user", content: prompt },
                ],
                max_tokens: 2000, // Aumentamos el límite de tokens
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Respuesta completa de la API:", JSON.stringify(response.data, null, 2));

        // Extraer el JSON del campo "reasoning"
        let rawContent = response.data.choices[0].message.reasoning;
        console.log("Contenido crudo (reasoning):", rawContent);

        // 🔹 Limpiar el JSON en "reasoning"
        rawContent = rawContent.replace(/\\n/g, "").replace(/\\"/g, '"');

        // 🔹 Intentar parsear como JSON
        try {
            const parsedContent = JSON.parse(rawContent);
            return parsedContent;
        } catch (err) {
            console.warn("Error al parsear JSON, devolviendo texto limpio.");
            return rawContent; // Si falla, devuelve el texto sin procesar
        }
    } catch (error) {
        if (error.response) {
            console.error("Error de la API:", error.response.data);
        } else if (error.request) {
            console.error("No se recibió respuesta:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        throw new Error("Error al extraer información con DeepSeek");
    }
}

// Función para verificar si el JSON está completo
function isJsonComplete(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (err) {
        return false;
    }
}

// Función para intentar completar el JSON (solo para casos simples)
function completeJson(jsonString) {
    // Intenta cerrar los corchetes y llaves faltantes
    if (!jsonString.trim().endsWith("}")) {
        jsonString += "}";
    }
    if (!jsonString.trim().endsWith("]")) {
        jsonString += "]";
    }
    return jsonString;
}

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});