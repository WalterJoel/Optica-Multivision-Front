import { useState } from "react";
import { buscarProductosVendidosPorRangoService } from "@/services/sales";
import { IProductoVendidoResponse } from "@/types/sales";
import ExcelJS from "exceljs";
import { formatearMedida } from "@/utils/lenses";

export function useProductosVendidos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargarReporteProductosVendidos = async (
    sedeId: number,
    fechaInicio: string,
    fechaFin: string
  ) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const data = await buscarProductosVendidosPorRangoService(sedeId, fechaInicio, fechaFin);
      if (!data || data.length === 0) {
        alert("No se encontraron productos vendidos en este rango de fechas.");
        return;
      }

      const backendSedeNombre = (data[0]?.nombreSede || `Sede_${sedeId}`).toUpperCase();
      const fechaActual = new Date().toLocaleString("es-PE");

      // Crear Libro de Trabajo ExcelJS
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Optica Multivision";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Productos Vendidos", {
        views: [{ showGridLines: true }],
      });

      // 1. CABECERAS DE TABLA (FILA 1 CON ESTILO DE COLOR AZUL DEL SISTEMA)
      const headers = [
        "SEDE",
        "CÓD. VENTA",
        "FECHA",
        "HORA",
        "TIPO PRODUCTO",
        "CÓD. PRODUCTO",
        "CÓDIGO",
        "CÓDIGO MONTURA",
        "DESCRIPCIÓN",
        "CANTIDAD",
        "PRECIO UNITARIO",
        "DESCUENTO",
        "SUBTOTAL",
        "ESFERA (ESF)",
        "CILINDRO (CYL)",
        "MATRIZ (LENTE)",
        "FILA",
        "COLUMNA",
        "UBICACIÓN FÍSICA",
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.values = headers;
      headerRow.height = 26;

      headerRow.eachCell((cell) => {
        cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1976D2" }, // Azul del sistema #1976D2
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {};
      });

      // 2. AGREGAR DATOS (A PARTIR DE LA FILA 2)
      data.forEach((item: IProductoVendidoResponse, index: number) => {
        const date = new Date(item.fechaVenta);
        const row = worksheet.getRow(2 + index);

        const montura = item.producto?.montura;
        const stock = item.stock;
        const lente = stock?.lente;
        const producto = item.producto;

        const descripcion =
          item.tipoProducto === "LENTE" && lente
            ? `LENTE ${lente.marca} (${lente.material})`
            : item.tipoProducto === "MONTURA" && montura
            ? `MONTURA ${montura.marca} (${montura.material})`
            : producto?.nombre ?? "";

        row.values = [
          (item.nombreSede || backendSedeNombre).toUpperCase(),
          item.ventaId,
          date.toLocaleDateString(),
          date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          item.tipoProducto,
          item.productoId || item.stockId,
          montura?.codigo ?? "",
          montura?.codigoMontura ?? "",
          descripcion,
          Number(item.cantidad),
          Number(item.precioUnitario),
          Number(item.descuento ?? 0),
          Number(item.subtotal),
          item.esf != null ? formatearMedida(item.esf) : "",
          item.cyl != null ? formatearMedida(item.cyl) : "",
          stock?.matrix ?? "",
          stock?.row ?? "",
          stock?.col ?? "",
          item.tipoProducto === "LENTE" ? stock?.ubicacion ?? "" : producto?.ubicacion ?? "",
        ];
      });

      // 3. AUTOAJUSTAR ANCHO DE COLUMNAS
      worksheet.columns.forEach((column) => {
        let maxLen = 10;
        column.eachCell?.({ includeEmpty: false }, (cell) => {
          const val = cell.value ? String(cell.value) : "";
          if (val.length > maxLen) {
            maxLen = val.length;
          }
        });
        column.width = Math.min(Math.max(maxLen + 4, 12), 45);
      });

      // 4. DESCARGAR ARCHIVO EN EL NAVEGADOR
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `Reporte_Productos_Vendidos_${backendSedeNombre.trim().replace(/\s+/g, "_")}_${fechaInicio}_${fechaFin}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      const backendMessage = err.response?.data?.message || err.message;
      setError(backendMessage || "Error al descargar el reporte");
      alert("Error al generar el reporte de excel: " + (backendMessage || ""));
    } finally {
      setLoading(false);
    }
  };

  return {
    descargarReporteProductosVendidos,
    loading,
    error,
  };
}
