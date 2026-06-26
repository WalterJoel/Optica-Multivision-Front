import { TipoProducto } from "@/commons/constants";
import * as XLSX from "xlsx";

// Plantilla vacía para crear accesorios
export const descargarPlantillaExcelVacia = () => {
  const plantillaVacia = [
    {
      CODIGO: "", // Ejemplo: ACC-01 (Código de accesorio)
      NOMBRE: "", // Ejemplo: Estuche Rígido Azul
      "PRECIO COMPRA": "", // Ejemplo: 5.50
      "PRECIO VENTA": "", // Ejemplo: 15.00
      COLOR: "", // Ejemplo: Azul
      CANTIDAD: "", // Ejemplo: 50
      TIPO: TipoProducto.ACCESORIO, // Prellenado por defecto para guiar al usuario (ACCESORIO)
    },
  ];

  // Crear libro y hoja de trabajo
  const hoja = XLSX.utils.json_to_sheet(plantillaVacia);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Carga Masiva");

  // Forzar la descarga
  XLSX.writeFile(libro, "Plantilla_Carga_Accesorios.xlsx");
};
