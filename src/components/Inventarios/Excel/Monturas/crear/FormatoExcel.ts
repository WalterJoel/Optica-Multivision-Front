import * as XLSX from "xlsx";

// Plantilla vacia para crear monturas
export const descargarPlantillaExcelVacia = (sedeId: number) => {
  const plantillaVacia = [
    {
      "PRECIO COMPRA": "", // Ejemplo: 45.50
      "PRECIO VENTA": "", // Ejemplo: 120.00
      TALLA: "", // Ejemplo: 52-18-140
      CODIGO: "", // Ejemplo: M-01 (CODIGO que coloca el dueño del negocio - puede repetirse)
      "CODIGO MONTURA": "", // Ejemplo: REY-2026 (CODIGO que coloca el dueño del negocio - puede repetirse)
      MARCA: "", // Ejemplo: Ray-Ban
      CANTIDAD: "", // Ejemplo: 10
      COLOR: "", // Ejemplo: Negro
      MATERIAL: "", // Ejemplo: Acetato
      TIPO: "MONTURA", // Prellenado por defecto para guiar al usuario
      SEDE: sedeId, // Debe ser numerico y lo dejamos fijado con la sede actual
    },
  ];

  // Crear libro y hoja de trabajo
  const hoja = XLSX.utils.json_to_sheet(plantillaVacia);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Carga Masiva");

  // Forzar la descarga
  XLSX.writeFile(libro, "Plantilla_Carga_Monturas.xlsx");
};
