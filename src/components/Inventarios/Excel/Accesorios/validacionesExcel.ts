import ExcelJS from "exceljs";
import { ClasificacionAccesorios } from "@/commons/constants";

// Columnas para Plantilla de Crear Accesorios
export const ACCESORIO_CREAR_COLUMNS = [
  { header: "CODIGO", key: "codigo", width: 15 },
  { header: "NOMBRE", key: "nombre", width: 25 },
  { header: "PRECIO COMPRA", key: "precioCompra", width: 15 },
  { header: "PRECIO VENTA", key: "precioVenta", width: 15 },
  { header: "COLOR", key: "color", width: 15 },
  { header: "CLASIFICACION", key: "clasificacion", width: 25 },
  { header: "CANTIDAD", key: "cantidad", width: 12 },
  { header: "TIPO", key: "tipo", width: 15 },
  { header: "SEDE", key: "sede", width: 10 },
];

// Columnas para Exportación al Editar Accesorios
export const ACCESORIO_EDITAR_COLUMNS = [
  { header: "PRODUCTOID", key: "PRODUCTOID", width: 12 },
  { header: "CODIGO", key: "CODIGO", width: 15 },
  { header: "NOMBRE", key: "NOMBRE", width: 25 },
  { header: "PRECIO COMPRA", key: "PRECIO COMPRA", width: 15 },
  { header: "PRECIO VENTA", key: "PRECIO VENTA", width: 15 },
  { header: "COLOR", key: "COLOR", width: 15 },
  { header: "CLASIFICACION", key: "CLASIFICACION", width: 25 },
  { header: "CANTIDAD", key: "CANTIDAD", width: 12 },
  { header: "TIPO", key: "TIPO", width: 15 },
  { header: "SEDE", key: "SEDE", width: 12 },
];

/**
 * Aplica validaciones de datos (desplegables + bloqueo estricto)
 * a cualquier hoja de trabajo de ExcelJS que contenga columnas de Accesorios.
 */
export const aplicarValidacionesAccesoriosExcel = (
  worksheet: ExcelJS.Worksheet,
  maxRows: number = 500
) => {
  const clasificacionesList = Object.values(ClasificacionAccesorios);
  const clasificacionesFormula = `"${clasificacionesList.join(",")}"`;

  let colClasifIdx = -1;

  // Detectar automáticamente el índice de la columna CLASIFICACION
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const val = String(cell.value || "").trim().toUpperCase();
    if (val === "CLASIFICACION") colClasifIdx = colNumber;
  });

  for (let row = 2; row <= maxRows; row++) {
    if (colClasifIdx > 0) {
      worksheet.getCell(row, colClasifIdx).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [clasificacionesFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Clasificación no válida",
        error: `Seleccione una opción válida: ${clasificacionesList.join(", ")}`,
      };
    }
  }
};
