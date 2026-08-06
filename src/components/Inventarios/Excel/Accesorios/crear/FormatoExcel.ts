import ExcelJS from "exceljs";
import { TipoProducto } from "@/commons/constants";
import { ACCESORIO_CREAR_COLUMNS, aplicarValidacionesAccesoriosExcel } from "../validacionesExcel";

// Plantilla vacía para crear accesorios con desplegables y validación de enums
export const descargarPlantillaExcelVacia = async (sedeId: number) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Carga Masiva");

  // Configuración de columnas y encabezados
  worksheet.columns = ACCESORIO_CREAR_COLUMNS;

  // Fila de guía inicial
  worksheet.addRow({
    codigo: "",
    nombre: "",
    precioCompra: "",
    precioVenta: "",
    color: "",
    clasificacion: "",
    cantidad: "",
    tipo: TipoProducto.ACCESORIO,
    sede: sedeId,
  });

  // Prellenar TIPO y SEDE para las filas de guía
  for (let row = 3; row <= 500; row++) {
    worksheet.getCell(`H${row}`).value = TipoProducto.ACCESORIO;
    worksheet.getCell(`I${row}`).value = sedeId;
  }

  // Aplicar validaciones reutilizables
  aplicarValidacionesAccesoriosExcel(worksheet, 500);

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
  anchor.download = "Plantilla_Carga_Accesorios.xlsx";
  anchor.click();
  window.URL.revokeObjectURL(url);
};
