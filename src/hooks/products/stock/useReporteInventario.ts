import { useState } from "react";
import ExcelJS from "exceljs";
import {
    IReporteInventarioPayload,
    IReporteInventarioResponse,
} from "@/types/products";
import { obtenerReporteInventarioService } from "@/services/products/stock";

export function useReporteInventario() {
    const [loading, setLoading] = useState(false);
    const [reporteInventario, setReporteInventario] = useState<
        IReporteInventarioResponse[]
    >([]);
    const [statusMessage, setMessage] = useState("");

    // Obtener reporte del backend
    const obtenerReporteInventario = async (
        payload: IReporteInventarioPayload
    ): Promise<IReporteInventarioResponse[] | null> => {
        setLoading(true);

        try {
            const response = await obtenerReporteInventarioService(payload);
            setReporteInventario(response);
            setMessage("Reporte cargado correctamente");
            return response;
        } catch (err: any) {
            const backendMessage = err.response?.data?.message;
            setMessage(backendMessage || "Error al cargar productos");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Generar y descargar Excel
    const descargarExcel = async (payload: IReporteInventarioPayload) => {
        if (loading) return;

        const data = await obtenerReporteInventario(payload);

        if (!data) {
            alert(statusMessage || "Error al obtener el reporte");
            return;
        }

        if (data.length === 0) {
            alert("No hay productos para exportar");
            return;
        }

        // Crear libro Excel
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Optica Multivision";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Reporte Inventario", {
            views: [{ showGridLines: true }],
        });

        // Definir encabezados
        const headers = [
            "SEDE ID",
            "PRODUCTO ID",
            "TIPO",
            "MONTURA ID",
            "ACCESORIO ID",
            "NOMBRE",
            "CÓDIGO",
            "MATERIAL",
            "TALLA",
            "COLOR",
            "CLASIFICACIÓN",
            "STOCK",
            "FECHA INVENTARIO",
            "ESTADO INVENTARIO",
        ];

        // Aplicar estilo al encabezado
        const headerRow = worksheet.getRow(1);
        headerRow.values = headers;
        headerRow.height = 26;

        headerRow.eachCell((cell) => {
            cell.font = {
                name: "Segoe UI",
                size: 10,
                bold: true,
                color: { argb: "FFFFFF" },
            };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "1976D2" },
            };
            cell.alignment = {
                horizontal: "center",
                vertical: "middle",
            };
        });

        // Agregar filas del reporte
        data.forEach((item) => {
            worksheet.addRow([
                item.sedeId,
                item.productoId,
                item.tipo,
                item.monturaId ?? "",
                item.accesorioId ?? "",
                item.nombre,
                item.codigo,
                item.material,
                item.talla,
                item.color,
                item.clasificacion,
                Number(item.stock),
                item.fechaInventario
                    ? new Date(item.fechaInventario).toLocaleString("es-PE", {
                        timeZone: "America/Lima",
                    })
                    : "",
                item.estadoInventario,
            ]);
        });

        // Ajustar ancho de columnas
        worksheet.columns.forEach((column) => {
            let maxLen = 10;

            column.eachCell?.({ includeEmpty: false }, (cell) => {
                maxLen = Math.max(maxLen, String(cell.value ?? "").length);
            });

            column.width = Math.min(Math.max(maxLen + 3, 12), 35);
        });

        // Descargar archivo Excel
        try {
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `Reporte_Inventario_Diario_${new Date()
                .toLocaleDateString("en-CA", { timeZone: "America/Lima" })
                .replace(/-/g, "_")}.xlsx`;

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            setMessage("Error al generar el archivo Excel");
            alert("Error al generar el archivo Excel");
        }
    };

    return {
        obtenerReporteInventario,
        descargarExcel,
        reporteInventario,
        loading,
        statusMessage,
    };
}