import { useState } from "react";
import { buscarProductosVendidosPorRangoService } from "@/services/sales";
import { IProductoVendidoResponse } from "@/types/sales";
import * as XLSX from "xlsx";

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

      const backendSedeNombre = data[0]?.nombreSede || `Sede_${sedeId}`;

      // Mapear los datos para que el Excel sea súper legible y profesional
      const mappedData = data.map((item: IProductoVendidoResponse) => {
        const date = new Date(item.fechaVenta);
        return {
          "SEDE ID": sedeId,
          "SEDE": (item.nombreSede || backendSedeNombre).toUpperCase(),
          "CÓD. VENTA": item.ventaId,
          "FECHA": date.toLocaleDateString(),
          "HORA": date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          "TIPO PRODUCTO": item.tipoProducto,
          "CÓD. PRODUCTO": item.productoId || item.stockId,
          "DESCRIPCIÓN": item.tipoProducto === "LENTE" && item.stock?.lente
            ? `LENTE ${item.stock.lente.marca} (${item.stock.lente.material})`
            : item.producto?.nombre || "—",
          "CANTIDAD": item.cantidad,
          "PRECIO UNITARIO": Number(item.precioUnitario),
          "DESCUENTO": Number(item.descuento || 0),
          "SUBTOTAL": Number(item.subtotal),
          "ESFERA (ESF)": item.esf || "—",
          "CILINDRO (CYL)": item.cyl || "—",
          "MATRIZ (LENTE)": item.stock?.matrix || "—",
          "FILA (LENTE)": item.stock?.row !== undefined && item.stock?.row !== null ? item.stock.row : "—",
          "COLUMNA (LENTE)": item.stock?.col !== undefined && item.stock?.col !== null ? item.stock.col : "—",
          "UBICACIÓN FÍSICA": item.tipoProducto === "LENTE"
            ? item.stock?.ubicacion || "—"
            : item.producto?.ubicacion || "—",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos Vendidos");

      // Autoajustar ancho de columnas para que se vea premium
      if (mappedData.length > 0) {
        const maxLens = Object.keys(mappedData[0]).map((key) => {
          return Math.max(
            key.length,
            ...mappedData.map((row: any) => String(row[key] ?? "").length)
          );
        });
        worksheet["!cols"] = maxLens.map((len) => ({ wch: len + 3 }));
      }

      XLSX.writeFile(workbook, `Reporte_Productos_Vendidos_${backendSedeNombre.trim().replace(/\s+/g, "_")}_${fechaInicio}_${fechaFin}.xlsx`);
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
