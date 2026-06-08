/**
 * Formatea cualquier objeto Date a un string local YYYY-MM-DD.
 */
export const formatToLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Retorna la fecha actual en formato local YYYY-MM-DD sin desfases de zona horaria (UTC).
 */
export const getLocalDateString = (): string => {
  const date = new Date();
  return formatToLocalDateString(date);
};

/**
 * Formatea un objeto Date al formato de fecha de Perú (DD/MM/YYYY).
 */
export const formatToPeruDateString = (date: Date): string => {
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formatea un objeto Date al formato de hora de Perú (12h am/pm).
 */
export const formatToPeruTimeString = (date: Date): string => {
  return date.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
