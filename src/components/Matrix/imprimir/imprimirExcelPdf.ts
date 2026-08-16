import ExcelJS from "exceljs";
import { ILens } from "@/types/products";

const cylValues = [
  0, -0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0, -2.25, -2.5, -2.75,
  -3.0, -3.25, -3.5, -3.75, -4.0, -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75,
  -6.0,
];

const esfValuesNegativo = [
  null,
  -0.25,
  -0.5,
  -0.75,
  -1.0,
  -1.25,
  -1.5,
  -1.75,
  -2.0,
  -2.25,
  -2.5,
  -2.75,
  -3.0,
  -3.25,
  -3.5,
  -3.75,
  -4.0,
  -4.25,
  -4.5,
  -4.75,
  -5.0,
  -5.25,
  -5.5,
  -5.75,
  -6.0,
];

const esfValuesPositivo = [
  0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5,
  3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0,
];

/**
 * Genera y descarga un libro de Excel (.xlsx) estilizado con bordes cuadriculados y colores,
 * con 2 pestañas (NEGATIVOS y POSITIVOS), sin filas/columnas de totales acumulados.
 */
export async function exportarMatrizExcel(
  activeLens: ILens | null | undefined,
  stockData: { NEGATIVO: any[]; POSITIVO: any[] }
) {
  if (!stockData || !stockData.NEGATIVO || !stockData.POSITIVO) {
    alert("No hay datos de matriz para exportar");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Optica ERP";
  workbook.created = new Date();

  // Estilo de bordes cuadriculados finos
  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: "FFB0BEC5" } },
    left: { style: "thin", color: { argb: "FFB0BEC5" } },
    bottom: { style: "thin", color: { argb: "FFB0BEC5" } },
    right: { style: "thin", color: { argb: "FFB0BEC5" } },
  };

  const buildWorksheet = (sheetName: string, type: "NEGATIVO" | "POSITIVO") => {
    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    });

    const rowsData = stockData[type] || [];
    const esfList = type === "NEGATIVO" ? esfValuesNegativo : esfValuesPositivo;

    // Fila 1: Título de cabecera con Marca y Material del Lente
    const nombreLenteText = activeLens
      ? `MATRIZ DE STOCK: ${activeLens.marca} (${activeLens.material}) - [${sheetName}]`
      : `MATRIZ DE STOCK - [${sheetName}]`;

    const titleRow = sheet.addRow([nombreLenteText]);
    sheet.mergeCells(1, 1, 1, cylValues.length + 1);
    const titleCell = titleRow.getCell(1);
    titleCell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF1E293B" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2E8F0" },
    };
    titleRow.height = 26;

    // Fila 2: Vacía
    sheet.addRow([]);

    // Fila 3: Encabezados de Cilindros (CYL)
    const headerValues = [
      "ESF \\ CYL",
      ...cylValues.map((cyl) => (cyl === 0 ? "0.00" : cyl.toFixed(2))),
    ];
    const headerRow = sheet.addRow(headerValues);
    headerRow.height = 24;

    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: type === "NEGATIVO" ? "FF1E3A8A" : "FF0F766E" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = thinBorder;
    });

    // Filas de datos por Esfera (ESF)
    rowsData.forEach((rowCells: any[], rowIndex: number) => {
      const esfVal = esfList[rowIndex];
      const esfLabel =
        esfVal === null || esfVal === 0
          ? "0.00"
          : esfVal > 0
          ? `+${esfVal.toFixed(2)}`
          : esfVal.toFixed(2);

      const cellQuantities = (rowCells || []).map((cell: any) => Number(cell?.cantidad || 0));
      const dataRow = sheet.addRow([esfLabel, ...cellQuantities]);
      dataRow.height = 22;

      dataRow.eachCell((cell, colIndex) => {
        cell.border = thinBorder;
        cell.alignment = { vertical: "middle", horizontal: "center" };

        if (colIndex === 1) {
          // Primera columna (Valores ESF)
          cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF0F172A" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF1F5F9" },
          };
        } else {
          // Celdas de Stock de la Matriz
          const qty = Number(cell.value || 0);
          if (qty > 0) {
            cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF15803D" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF0FDF4" },
            };
          } else {
            cell.font = { name: "Arial", size: 10, color: { argb: "FF94A3B8" } };
          }
        }
      });
    });

    // Ancho de columnas equilibrado
    sheet.columns.forEach((col, idx) => {
      if (idx === 0) {
        col.width = 14;
      } else {
        col.width = 9;
      }
    });
  };

  buildWorksheet("NEGATIVOS", "NEGATIVO");
  buildWorksheet("POSITIVOS", "POSITIVO");

  const nombreLente = activeLens
    ? `${activeLens.marca}_${activeLens.material}`.replace(/\s+/g, "_")
    : "Lente";

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Matriz_Stock_${nombreLente}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Genera dinámicamente el PDF/Impresión de 2 páginas (NEGATIVOS y POSITIVOS) al presionar el botón,
 * sin necesidad de tener componentes HTML de impresión renderizados en la página.
 */
export function exportarMatrizPdf(
  activeLens: ILens | null | undefined,
  stockData: { NEGATIVO: any[]; POSITIVO: any[] }
) {
  if (!stockData || !stockData.NEGATIVO || !stockData.POSITIVO) {
    alert("No hay datos de matriz para exportar");
    return;
  }

  const nombreLente = activeLens
    ? `${activeLens.marca} (${activeLens.material})`
    : "Lente";
  const fecha = new Date().toLocaleDateString();

  const buildTableHtml = (
    type: "NEGATIVO" | "POSITIVO",
    title: string,
    pageNum: string,
    bgHeaderClass: string
  ) => {
    const rowsData = stockData[type] || [];
    const esfList = type === "NEGATIVO" ? esfValuesNegativo : esfValuesPositivo;

    let headersHtml = `<th>ESF \\ CYL</th>`;
    cylValues.forEach((cyl) => {
      headersHtml += `<th>${cyl === 0 ? "0.00" : cyl.toFixed(2)}</th>`;
    });

    let bodyHtml = "";
    rowsData.forEach((rowCells: any[], rIdx: number) => {
      const esf = esfList[rIdx];
      const esfLabel =
        esf === null || esf === 0
          ? "0.00"
          : esf > 0
          ? `+${esf.toFixed(2)}`
          : esf.toFixed(2);

      let cellsHtml = `<td class="esf-col">${esfLabel}</td>`;
      (rowCells || []).forEach((cell: any) => {
        const qty = Number(cell?.cantidad || 0);
        const cellClass = qty > 0 ? "qty-cell active" : "qty-cell zero";
        cellsHtml += `<td class="${cellClass}">${qty}</td>`;
      });

      bodyHtml += `<tr>${cellsHtml}</tr>`;
    });

    return `
      <div class="print-page">
        <div class="header">
          <div>
            <h1>MATRIZ DE STOCK DE LENTES — ${title}</h1>
            <p>LENTE: ${nombreLente} | FECHA: ${fecha}</p>
          </div>
          <div class="badge ${bgHeaderClass}">${title} (${pageNum})</div>
        </div>
        <table class="matrix-table">
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>
    `;
  };

  const htmlNegativos = buildTableHtml(
    "NEGATIVO",
    "NEGATIVOS",
    "PÁGINA 1 DE 2",
    "bg-negativo"
  );
  const htmlPositivos = buildTableHtml(
    "POSITIVO",
    "POSITIVOS",
    "PÁGINA 2 DE 2",
    "bg-positivo"
  );

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Matriz de Stock - ${nombreLente}</title>
        <style>
          @page { size: A4 landscape; margin: 4mm; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: white; color: #0f172a; }
          .print-page { page-break-after: always; break-after: page; padding: 2px; }
          .print-page:last-child { page-break-after: avoid; break-after: avoid; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; }
          .header h1 { font-size: 13pt; margin: 0; font-weight: 900; text-transform: uppercase; color: #0f172a; }
          .header p { font-size: 8.5pt; margin: 2px 0 0 0; color: #475569; font-weight: bold; }
          .badge { font-size: 7.5pt; font-weight: bold; color: white; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
          .bg-negativo { background-color: #1e293b; }
          .bg-positivo { background-color: #0f766e; }
          .matrix-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
          .matrix-table th, .matrix-table td { border: 1px solid #cbd5e1; text-align: center; height: 22px; padding: 2px; }
          .matrix-table th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          .esf-col { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          .qty-cell.active { font-weight: bold; color: #15803d; background-color: #f0fdf4; }
          .qty-cell.zero { color: #94a3b8; }
        </style>
      </head>
      <body>
        ${htmlNegativos}
        ${htmlPositivos}
      </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(fullHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  }
}
