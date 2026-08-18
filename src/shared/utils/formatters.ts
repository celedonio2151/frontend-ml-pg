import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Asegúrate de importar el idioma español
dayjs.locale('es'); // use Spanish locale globally

export function formateDate(datep: string | Date, format = 'ddd DD MMM YYYY') {
  const date = dayjs(datep);
  date.locale('es');
  const formattedDate = date.format(format);
  // console.log(formattedDate); // "Lunes 12 Oct 2023"
  return formattedDate;
}

export function calculateDaysRemaining(startDate: string | Date, endDate: string | Date) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  dayjs.locale('es'); // Establecer el idioma a español

  const daysDifference = end.diff(start, 'days');

  if (daysDifference >= 1) {
    return `${daysDifference} días restantes`;
  } else {
    const hoursDifference = end.diff(start, 'hours');
    return `${hoursDifference} horas restantes`;
  }
}

export function formatCubicMeters(value: number) {
  return `${value.toLocaleString('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} m³`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-BO', {
    currency: 'BOB',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(value);
}
