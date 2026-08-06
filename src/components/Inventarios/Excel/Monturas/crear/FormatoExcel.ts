import ExcelJS from "exceljs";
import { TipoProducto } from "@/commons/constants";
import { MONTURA_CREAR_COLUMNS, aplicarValidacionesMonturasExcel } from "../validacionesExcel";

// Plantilla vacía para crear monturas con validación de enums y desplegables
export const descargarPlantillaExcelVacia = async (sedeId: number) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Carga Masiva");

  // Configuración de columnas y encabezados
  worksheet.columns = MONTURA_CREAR_COLUMNS;

  // Fila de guía / ejemplo inicial en fila 2
  worksheet.addRow({
    codigo: "",
    codigoMontura: "",
    precioCompra: "",
    precioVenta: "",
    marca: "",
    material: "",
    talla: "",
    color: "",
    clasificacion: "",
    sexo: "",
    formaFacial: "",
    cantidad: "",
    tipo: TipoProducto.MONTURA,
    sede: sedeId,
  });

  // Aplicar validaciones reutilizables (listas desplegables en celdas hasta la fila 500)
  aplicarValidacionesMonturasExcel(worksheet, 500);

  // Estilo para la fila de encabezado
  worksheet.getRow(1).font = { bold: true };

  // Escribir el libro de Excel en buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "Plantilla_Carga_Monturas.xlsx";
  anchor.click();
  window.URL.revokeObjectURL(url);
};
