import ExcelJS from "exceljs";
import { ClasificacionMonturas, SexoMontura, FormaFacial } from "@/commons/constants";

// Columnas para Plantilla de Crear Monturas
export const MONTURA_CREAR_COLUMNS = [
  { header: "CODIGO", key: "codigo", width: 15 },
  { header: "CODIGO MONTURA", key: "codigoMontura", width: 18 },
  { header: "PRECIO COMPRA", key: "precioCompra", width: 15 },
  { header: "PRECIO VENTA", key: "precioVenta", width: 15 },
  { header: "MARCA", key: "marca", width: 15 },
  { header: "MATERIAL", key: "material", width: 15 },
  { header: "TALLA", key: "talla", width: 15 },
  { header: "COLOR", key: "color", width: 12 },
  { header: "CLASIFICACION", key: "clasificacion", width: 18 },
  { header: "SEXO", key: "sexo", width: 12 },
  { header: "FORMA FACIAL", key: "formaFacial", width: 15 },
  { header: "CANTIDAD", key: "cantidad", width: 12 },
  { header: "TIPO", key: "tipo", width: 12 },
  { header: "SEDE", key: "sede", width: 10 },
];

// Columnas para Exportación al Editar Monturas
export const MONTURA_EDITAR_COLUMNS = [
  { header: "PRODUCTOID", key: "PRODUCTOID", width: 12 },
  { header: "CODIGO", key: "CODIGO", width: 15 },
  { header: "CODIGO MONTURA", key: "CODIGO MONTURA", width: 18 },
  { header: "PRECIO COMPRA", key: "PRECIO COMPRA", width: 15 },
  { header: "PRECIO VENTA", key: "PRECIO VENTA", width: 15 },
  { header: "MARCA", key: "MARCA", width: 15 },
  { header: "MATERIAL", key: "MATERIAL", width: 15 },
  { header: "TALLA", key: "TALLA", width: 15 },
  { header: "COLOR", key: "COLOR", width: 12 },
  { header: "CLASIFICACION", key: "CLASIFICACION", width: 18 },
  { header: "SEXO", key: "SEXO", width: 12 },
  { header: "FORMA FACIAL", key: "FORMA FACIAL", width: 15 },
  { header: "CANTIDAD", key: "CANTIDAD", width: 12 },
  { header: "TIPO", key: "TIPO", width: 12 },
  { header: "SEDE", key: "SEDE", width: 12 },
];

/**
 * Aplica validaciones de datos (desplegables + bloqueo estricto)
 * a cualquier hoja de trabajo de ExcelJS que contenga columnas de Monturas.
 */
export const aplicarValidacionesMonturasExcel = (
  worksheet: ExcelJS.Worksheet,
  maxRows: number = 500
) => {
  const clasificacionesList = Object.values(ClasificacionMonturas);
  const clasificacionesFormula = `"${clasificacionesList.join(",")}"`;

  const sexosList = Object.values(SexoMontura);
  const sexosFormula = `"${sexosList.join(",")}"`;

  const formasList = Object.values(FormaFacial);
  const formasFormula = `"${formasList.join(",")}"`;

  let colClasifIdx = -1;
  let colSexoIdx = -1;
  let colFormaIdx = -1;

  // Detectar automáticamente los índices de columna según sus encabezados
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const val = String(cell.value || "").trim().toUpperCase();
    if (val === "CLASIFICACION") colClasifIdx = colNumber;
    if (val === "SEXO") colSexoIdx = colNumber;
    if (val === "FORMA FACIAL") colFormaIdx = colNumber;
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

    if (colSexoIdx > 0) {
      worksheet.getCell(row, colSexoIdx).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [sexosFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Sexo no válido",
        error: `Seleccione una opción válida: ${sexosList.join(", ")}`,
      };
    }

    if (colFormaIdx > 0) {
      worksheet.getCell(row, colFormaIdx).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [formasFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Forma Facial no válida",
        error: `Seleccione una opción válida: ${formasList.join(", ")}`,
      };
    }
  }
};
