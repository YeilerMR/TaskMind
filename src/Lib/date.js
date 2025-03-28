import { formatInTimeZone } from 'date-fns-tz';

export async function getDateCR() {
  try {
    const timeZone = 'America/Costa_Rica';
    // Genera la fecha en el formato correcto para SQL Server
    const formattedDate = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss');
    return formattedDate; // Debería ser una cadena en el formato adecuado
  } catch (error) {
    console.error('Error al obtener la fecha:', error);
    throw error;
  }
}
