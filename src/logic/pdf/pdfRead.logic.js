import fs from 'fs';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import Professor from '../../model/professorModel.js';
import Course from '../../model/course.model.js';
import User from '../../model/user.model.js';

export async function extraerClavesYValores(pdfBuffer) {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer }); // <- usamos directamente el buffer
    const pdf = await loadingTask.promise;
  
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    const textos = content.items.map(item => item.str.trim()).filter(Boolean);
  
    const resultado = {};
    let claveActual = null;
    let iniciarCaptura = false;
  
    for (const linea of textos) {
      if (!iniciarCaptura) {
        if (linea.endsWith(':')) {
          iniciarCaptura = true;
          claveActual = linea.slice(0, -1).trim().replace(/\s+/g, '_');
          resultado[claveActual] = '';
        }
      } else {
        if (linea.endsWith(':')) {
          claveActual = linea.slice(0, -1).trim().replace(/\s+/g, '_');
          resultado[claveActual] = '';
        } else if (claveActual) {
          resultado[claveActual] += (resultado[claveActual] ? ' ' : '') + linea;
        }
      }
    }
  
    // Limpieza específica del campo correo
    if (resultado['CORREO_ELECTRÓNICO']) {
      const textoNoDeseado = "En esta Universidad nos comprometemos a prevenir, investigar y sancionar el hostigamiento sexual";
      const index = resultado['CORREO_ELECTRÓNICO'].indexOf(textoNoDeseado);
      if (index !== -1) {
        resultado['CORREO_ELECTRÓNICO'] = resultado['CORREO_ELECTRÓNICO'].substring(0, index).trim();
      }
    }
  
    return resultado;
  }
  


  export const createCourseFromPdfController = async (req, res) => {
    try {
      const pdfBuffer = req.file;
      const cedula = req.params.id;

      
      console.log(cedula);
      console.log(pdfBuffer);
      if (!pdfBuffer || !cedula) {
        return res.status(400).json({ error: 'Se requiere el PDF y la cédula del usuario en params.' });
      }

  
      const dataPdf = await extraerClavesYValores(pdfBuffer.buffer);
  
      const user = await User.findOne({
        where: { DSC_IDENTIFICATION: cedula },
        attributes: ['ID_USER'],
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado con esa cédula.' });
      }
  
      const correoBruto = dataPdf.CORREO_ELECTRÓNICO || '';
      const correoLimpio = correoBruto.replace(/\s+/g, '').toLowerCase();
      const nombreCompleto = (dataPdf.PERSONA_DOCENTE || '').split(' ');
  
      if (nombreCompleto.length < 3) {
        return res.status(400).json({ error: 'Nombre del profesor inválido o incompleto.' });
      }
  
      let profesor = await Professor.findOne({ where: { DSC_EMAIL: correoLimpio } });
  
      if (!profesor) {
        profesor = await Professor.create({
          DSC_FIRST_NAME: nombreCompleto[0],
          DSC_LAST_NAME_ONE: nombreCompleto[nombreCompleto.length - 2],
          DSC_LAST_NAME_TWO: nombreCompleto[nombreCompleto.length - 1],
          DSC_EMAIL: correoLimpio,
          DSC_PHONE: 'N/A',
          STATUS: 1,
        });
      }
  
      // Crear curso
      const cursoData = {
        DSC_NAME: dataPdf.NOMBRE_DEL_CURSO,
        DSC_CODE: extraerCodigoCurso(dataPdf['CÓDIGO_DE_CURSO']),
        DSC_ATTENTION: dataPdf.HORAS_DOCENTE || '',
        DSC_COLOR: '#f6eba0',
        ID_USER: user.ID_USER,
        ID_TEACHER: profesor.ID_TEACHER,
      };
  

      const nuevoCurso = await Course.create(cursoData);
      return res.status(201).json({ message: 'Curso creado exitosamente.', curso: nuevoCurso });
  
    } catch (err) {
      console.error("❌ Error al crear curso desde PDF:", err);
      return res.status(500).json({ error: 'Error interno al procesar el PDF.' });
    }
  };


  function extraerCodigoCurso(texto) {
    if (!texto) return '';
    const match = texto.match(/[A-Z]{2,}\d{3,}/); 
    return match ? match[0] : texto.trim();
  }