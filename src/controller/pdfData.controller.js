import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

export async function extraerClavesYValores(pathPdf) {
  const data = new Uint8Array(fs.readFileSync(pathPdf));
  const loadingTask = pdfjsLib.getDocument({ data });
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (__filename === process.argv[1]) {
  const pathPdf = path.resolve(__dirname, '../uploads/EIF4200 - Programa Inteligencia Artificial.pdf');
  console.log("Iniciando extracción...");
    extraerClavesYValores(pathPdf)
    .then(data => console.log("📋 Datos extraídos:\n", data))
    .catch(console.error);

}
